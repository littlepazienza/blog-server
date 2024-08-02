
#![feature(proc_macro_hygiene, decl_macro)]
#[macro_use] extern crate rocket;

use mongodb::{
    sync::{Client, Collection},
    bson::doc,
};
use random_string::generate;
use random_string::Charset;
use rocket::data::{Data};
use rocket::http::{ContentType};
use rocket_multipart_form_data::{mime, MultipartFormDataOptions, MultipartFormData, MultipartFormDataField, Repetition};
use std::env;
use std::fs;
use std::path::Path;

static mut FILE_PATH: "./var/blog-images"

fn get_blog_collection() -> Collection {
    match Client::with_uri_str("mongodb://mongo:27017") {
        Ok(client) => client.database("ienza-tech").collection("blogs"),
        Err(e) => {
            println!("Error while communicating with MONGODB{:?}", e);
            panic!()
        },
    }
}

fn get_id() -> Option<String> {
    let charset = Charset::new("123456789abcdefghijklmnopqrstuvwxyz");
    match charset {
        Some(charset) => {
            let collection = get_blog_collection();
            let mut n = 30;
            while n > 0 {
                let id = generate(6, &charset).to_string();
                match collection.find_one(doc! { "id": id.clone()}, None) {
                    Ok(Some(_result)) => {
                        n -= 1;
                        continue;
                    },
                    Ok(None) => return Some(id),
                    Err(e) => println!("Server error while making sure key is unique: {:?}", e)
                }
            }
            println!("Unable to generate a unique key after 30 attemps");
        },
        None => println!("Unable to get valid ID charset")
    }
    return None;
}

#[get("/errors/internal")]
fn get_internal_error_message() -> String {
    "There was an interal server error while fetching your URL, sorry lol".to_string()
}

#[get("/errors/bad")]
fn get_bad_message() -> String {
    "The URL you requested is not in our database".to_string()
}

/// Given an ID get the blog
#[get("/<id>")]
fn get_blog(id: String) -> String {
    let collection = get_blog_collection();

    // Find the doc, and find all fields required in the doc
    match collection.find_one(doc! { "_id": id.clone()}, None) {
        Ok(Some(result)) => {
            match result.get_str("title") {
                Ok(title) => match result.get_str("story") {
                    Ok(story) => match result.get_str("text") {
                        Ok(text) => match result.get_str("date") {
                            Ok(date) => return format!("id:\"{}\",title:\"{}\",text:\"{}\",story:\"{}\",date:\"{}\"", id, title, text, story, date),
                            Err(e) => println!("Failed to get the date from the doc {}: {}", id, e),
                        },
                        Err(e) => println!("Failed to get the text from the doc {}: {}", id, e),
                    },
                    Err(e) => println!("Failed to get the story from the doc {}: {}", id, e),
                },
                Err(e) => println!("Failed to get the title from the doc {}: {}", id, e),
            }
        },
        Ok(None) => {
            println!("The document with ID {} doesn't exist", id);
            return String::from("");
        },
        Err(e) => println!("Failed while finding the document {}: {}", id, e)
    }
    return String::from("-1");
}

#[get("/manage/all")]
fn get_all() -> String {
    let mut vars = String::from("{\"blogs\":[ ");
    let collection = get_blog_collection();

    // Loop through the collection and create the response
    match collection.find(doc! {}, None) {
        Ok(cursor) => {
            for i in cursor {
              match i {
                Ok(doc) => {
                    match doc.get_str("_id") {
                        Ok(id) => match doc.get_str("title") {
                            Ok(title) => match doc.get_str("story") {
                                Ok(story) => match doc.get_str("text") {
                                    Ok(text) => match doc.get_str("date") {
                                        Ok(date) => {
                                            vars.push_str(&"{\"id\":\"".to_string());
                                            vars.push_str(&id.to_string());
                                            vars.push_str(&"\",\"title\":\"".to_string());
                                            vars.push_str(&title.to_string());
                                            vars.push_str(&"\",\"text\":\"".to_string());
                                            vars.push_str(&text.to_string());
                                            vars.push_str(&"\",\"story\":\"".to_string());
                                            vars.push_str(&story.to_string());
                                            vars.push_str(&"\",\"date\":\"".to_string());
                                            vars.push_str(&date.to_string());
                                            vars.push_str(&"\"".to_string());
                                            vars.push_str(&"}".to_string());
                                            vars.push_str(&",".to_string());

                                        },
                                        Err(e) => println!("Error getting doc {:?}", e)
                                    },
                                    Err(e) => println!("Error getting doc {:?}", e)
                                },
                                Err(e) => println!("Error getting doc {:?}", e)
                            },
                            Err(e) => println!("Error getting doc {:?}", e)
                        },
                        Err(e) => println!("Error getting doc {:?}", e)
                    }
                },
                Err(e) => println!("Error getting doc {:?}", e)
              }
            }
        },
        Err(e) => println!("Error getting all docs {:?}", e)
    }
    vars.pop();
    vars.push_str(&"]}".to_string());
    return vars;
}

/// Add a blog to the database and get the id of the new blog
#[post("/manage/add", data = "<data>")]
async fn add_blog(content_type: &ContentType, data: Data<'_>) -> String {
    let mut title = String::from("");
    let mut story = String::from("");
    let mut text = String::from("");
    let mut date = String::from("");
    let mut files = Vec::new();

    let id;
    match get_id() {
        Some(val) => id = val,
        None => return String::from("Unable to create an ID for this blog")
    }

    let options = MultipartFormDataOptions::with_multipart_form_data_fields(
        vec! [
            MultipartFormDataField::file("files").repetition(Repetition::fixed(5)).content_type_by_string(Some(mime::IMAGE_STAR)).unwrap(),
            MultipartFormDataField::raw("fingerprint").size_limit(4096),
            MultipartFormDataField::text("title"),
            MultipartFormDataField::text("text"),
            MultipartFormDataField::text("story"),
            MultipartFormDataField::text("date"),
        ]
    );

    let mut multipart_form_data = MultipartFormData::parse(content_type, data, options).await.unwrap();

    let photos = multipart_form_data.files.remove("files"); // Use the get method to preserve file fields from moving out of the MultipartFormData instance in order to delete them automatically when the MultipartFormData instance is being dropped
    let fingerprint = multipart_form_data.raw.remove("fingerprint"); // Use the remove method to move raw fields out of the MultipartFormData instance (recommended)
    let title_data = multipart_form_data.texts.remove("title"); // Use the remove method to move text fields out of the MultipartFormData instance (recommended)
    let text_data = multipart_form_data.texts.remove("text");
    let story_data = multipart_form_data.texts.remove("story");
    let date_data = multipart_form_data.texts.remove("date");

    if let Some(file_fields) = photos {
        let mut n = 0;
        for file_field in file_fields {
            n += 1;
            let _content_type = &file_field.content_type;
            let _file_name = &file_field.file_name;
            match _file_name {
                Some(file) => {
                    let _path = &file_field.path;
                    let destination;
                    unsafe {
                        destination = format!("{}/{}-{}", FILE_PATH, n, file);
                    }
                    match _path.as_path().to_str() {
                        Some(str) => {
                            println!("Checking if file {} exists... {}", str, _path.as_path().exists());
                            unsafe {
                                println!("Checking if destination folder {} exists... {}", FILE_PATH, Path::new(&FILE_PATH).exists());
                            }
                            match fs::copy(format!("{}", str), destination.clone()) {
                                Ok(_) => {
                                    println!("Saved uploaded file");
                                    files.push(destination);
                                },
                                Err(e) => println!("Error saving uploaded file {}", e)
                            }
                        },
                        None => return format!("Unable to get the path of the uploaded file")
                    }
                },
                None => println!("Error finding file name")
            }
        }
    }

    if let Some(mut raw_fields) = fingerprint {
        let raw_field = raw_fields.remove(0); // Because we only put one "fingerprint" field to the allowed_fields, the max length of this raw_fields is 1.

        let _content_type = raw_field.content_type;
        let _file_name = raw_field.file_name;
        let _raw = raw_field.raw;

        // You can now deal with the raw data.
    }

    if let Some(mut text_fields) = title_data {
        let text_field = text_fields.remove(0); // Because we only put one "text" field to the allowed_fields, the max length of this text_fields is 1.

        let _content_type = text_field.content_type;
        let _file_name = text_field.file_name;
        let _text = text_field.text;

        // You can now deal with the text data.
        println!("The new blogs title is {}", _text);
        title = _text;
    }

    if let Some(mut text_fields) = text_data {
        let text_field = text_fields.remove(0); // Because we only put one "text" field to the allowed_fields, the max length of this text_fields is 1.

        let _content_type = text_field.content_type;
        let _file_name = text_field.file_name;
        let _text = text_field.text;

        // You can now deal with the text data.
        println!("The new blogs text is {}", _text);
        text = _text;
    }

    if let Some(mut text_fields) = story_data {
        let text_field = text_fields.remove(0); // Because we only put one "text" field to the allowed_fields, the max length of this text_fields is 1.

        let _content_type = text_field.content_type;
        let _file_name = text_field.file_name;
        let _text = text_field.text;

        // You can now deal with the text data.
        println!("The new blog's story is {}", _text);
        story = _text;
    }

    if let Some(mut text_fields) = date_data {
        let text_field = text_fields.remove(0); // Because we only put one "text" field to the allowed_fields, the max length of this text_fields is 1.

        let _content_type = text_field.content_type;
        let _file_name = text_field.file_name;
        let _text = text_field.text;

        // You can now deal with the text data.
        println!("The new blog's date is {}", _text);
        date = _text;
    }

    let collection = get_blog_collection();
    match collection.insert_one(doc! {"title": title.clone(), "_id": id.clone(), "text": text.clone(), "story":story.clone(), "date": date.clone(), "files": files}, None) {
        Ok(_result) => return format!("Your new blog ID is: {}", id),
        Err(e) => {
            println!("Database error while inserting blog to db: {:?}", e);
            return "Internal Database Error".to_string();
        }
    }
}

/// Ignite the rocket and then sit patiently and wait while it crushes the game
#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![get_all, get_blog, add_blog, get_bad_message, get_internal_error_message])
}
