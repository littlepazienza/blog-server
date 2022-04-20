
#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use random_string::generate;
use random_string::Charset;
use mongodb::{
    sync::{Client, Collection},
    bson::doc,
};
use rocket::response::{
    Response,
    Redirect,
    content::{self, Html},
};
use rocket::http::Status;
use rocket::request::Form;
use std::fs;
use std::io::Cursor;


#[derive(FromForm)]
pub struct BlogBody {
    id: String,
    title: String,
    text: String,
    story: String,
    date: String,
}

fn get_blog_collection() -> Collection {
    match Client::with_uri_str("mongodb://localhost:27017") {
        Ok(client) => client.database("ienza-tech").collection("blogs"),
        Err(e) => {
            println!("Error while communicating with MONGODB{:?}", e);
            panic!()
        },
    }
}

fn get_id() -> String {
    let charset = Charset::new("123456789abcdefghijklmnopqrstuvwxyz");
    match charset {
        Some(charset) => generate(6, &charset).to_string(),
        None => "Somehow this broke".to_string()
    }
}

fn get_redirect(redirect_url: String) -> Redirect{
    Redirect::to(redirect_url)
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
//#[get("/<id>")]
//fn get_blog(id: String) -> Redirect {
    // get a specific blog
//}

#[get("/manage/all")]
fn get_all() -> Response< 'static> {
    let mut vars = String::from("{");
    vars.push_str(&"\"blogs\":[".to_string());
    let collection = get_blog_collection();
    match collection.find(doc! {}, None) {
        Ok(cursor) => {
            for i in cursor {
              match i {
                Ok(doc) => {
                    match doc.get_str("id") {
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
                                            vars.push_str(&"},".to_string());
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
        Err(e) => {
            println!("Database error while getting all docs {:?}", e);
        }
    }
    vars.pop();
    vars.push_str(&"]}".to_string());
    let mut response = Response::new();
    response.set_sized_body(Cursor::new(vars));
    response.adjoin_raw_header("Access-Control-Allow-Origin", "https://blog.paz.ienza.tech");
    response.set_status(Status::Accepted);
    return response;
}


/// Add a blog to the database and get the id of the new blog
#[post("/manage/add", data = "<body>")]
fn add_blog(body: Form<BlogBody>) -> String {
    let title = body.title.clone();
    let story = body.story.clone();
    let text = body.text.clone();
    let date = body.date.clone();
    let collection = get_blog_collection();

    let mut n = 30;
    while n > 0 {
        let id = get_id();
        match collection.find_one(doc! { "id": id.clone()}, None) {
            Ok(Some(_result)) => {
                n -= 1;
                continue;
            },
            Ok(None) => {
                match collection.insert_one(doc! {"title": title.clone(), "id": id.clone(), "text": text.clone(), "story":story.clone(), "date": date.clone()}, None) {
                    Ok(_result) => return format!("Your new blog ID is: {}", id),
                    Err(e) => {
                        println!("Database error while inserting blog to db: {:?}", e);
                        return "Internal Database Error".to_string();
                    }
                }
            },
            Err(e) => {
                println!("Server error while making sure key is unique: {:?}", e);
                return "Internal Database Error".to_string();
            }
        }
    }
    return "Unable to generate a unique key after 30 attemps".to_string();
}

/// Ignite the rocket and then sit patiently and wait while it crushes the game
fn main() {
    rocket::ignite().mount("/", routes![get_all, add_blog, get_bad_message, get_internal_error_message]).launch();
}
