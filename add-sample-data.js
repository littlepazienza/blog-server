// MongoDB Sample Data Script for Blog Website
// This script adds realistic sample blog data to the MongoDB database
// Run with: docker exec -i blog-mongo mongosh < add-sample-data.js

// Connect to the database
db = db.getSiblingDB('ienza-tech');
print("Connected to ienza-tech database");

// Clear existing data (optional - comment out to preserve existing data)
db.blogs.drop();
print("Dropped existing blogs collection");

// Create sample blog posts
const sampleBlogs = [
  {
    _id: "abc123",
    title: "Getting Started with Angular and TypeScript",
    text: "Angular is a powerful frontend framework that pairs perfectly with TypeScript to create robust web applications. In this post, I'll walk through setting up a new Angular project and explain the key TypeScript features that make development more productive.\n\nFirst, let's install the Angular CLI: `npm install -g @angular/cli`. This tool simplifies project creation and management. Once installed, create a new project with `ng new my-project`.\n\nTypeScript brings several advantages to Angular development:\n\n1. **Strong typing**: Catch errors at compile time rather than runtime\n2. **Enhanced IDE support**: Better autocomplete and refactoring tools\n3. **Interfaces and generics**: Create more maintainable code structures\n4. **Decorators**: Angular leverages TypeScript decorators for components, services, and more\n\nOne of my favorite TypeScript features is interface definition. For example:\n\n```typescript\ninterface Blog {\n  id: string;\n  title: string;\n  text: string;\n  story: string;\n  date: string;\n  files?: string[];\n}\n```\n\nThis makes your component properties and service methods self-documenting and enables the compiler to catch type mismatches.\n\nIn future posts, I'll dive deeper into Angular's component architecture and show how to build a complete blog application with proper state management.",
    story: "Programming",
    date: "2025-08-01",
    files: ["/var/blog-images/1-angular-typescript.jpg", "/var/blog-images/2-code-example.png"]
  },
  {
    _id: "def456",
    title: "Homemade Sourdough: Mastering the Perfect Loaf",
    text: "My journey into sourdough baking began during the lockdowns of 2023, and I've been perfecting my technique ever since. Today I'm sharing my recipe and method for creating bakery-quality sourdough at home.\n\nThe key to great sourdough is a healthy, active starter. I feed mine daily with equal parts flour and water, maintaining it at room temperature. Before baking, ensure your starter passes the float test: drop a small amount in water, and if it floats, it's ready to use.\n\nHere's my basic recipe for two loaves:\n\n- 800g bread flour\n- 200g whole wheat flour\n- 700g water (adjust based on flour absorption)\n- 200g active sourdough starter\n- 20g salt\n\nThe process spans about 24 hours:\n\n1. **Autolyse**: Mix flours and water, rest for 1 hour\n2. **Add starter and salt**: Incorporate thoroughly\n3. **Bulk fermentation**: 4-6 hours with stretch and folds every 30 minutes for the first 2 hours\n4. **Pre-shape and bench rest**: 20-30 minutes\n5. **Final shaping and cold proof**: 12-16 hours in the refrigerator\n6. **Bake**: 30 minutes covered at 500°F, then 15-20 minutes uncovered at 450°F\n\nThe long fermentation develops complex flavors and that characteristic open, airy crumb. Don't rush this process—patience is truly rewarded in sourdough baking.\n\nFor the best crust, I use a Dutch oven to create steam during the initial baking phase. This mimics professional steam-injected ovens and gives that beautiful crackling crust.\n\nHappy baking!",
    story: "Cooking",
    date: "2025-07-25",
    files: ["/var/blog-images/1-sourdough-loaf.jpg", "/var/blog-images/2-crumb-structure.jpg"]
  },
  {
    _id: "ghi789",
    title: "Indoor Herb Garden: Fresh Flavors Year-Round",
    text: "Growing herbs indoors is one of the most rewarding ways to bring gardening into your home. Not only do fresh herbs elevate your cooking, but the plants themselves add life and beauty to any kitchen or windowsill.\n\nI've been maintaining my indoor herb garden for three years now, and I've learned which varieties thrive indoors and which are better left to outdoor gardens. Here are my top recommendations for indoor herbs:\n\n1. **Basil**: Loves bright light and regular harvesting. Keep soil consistently moist but not soggy.\n\n2. **Mint**: Almost too easy to grow! Prefers partial sun and regular watering. Keep it in its own container as it will take over.\n\n3. **Chives**: Low maintenance and long-lasting. Harvest outer leaves first, leaving the center to continue growing.\n\n4. **Rosemary**: Mediterranean herb that prefers drier conditions. Ensure good drainage and bright light.\n\n5. **Thyme**: Another Mediterranean herb that thrives in bright light with minimal watering.\n\nFor successful indoor herbs, consider these key factors:\n\n- **Light**: Most herbs need at least 6 hours of bright light daily. South or west-facing windows are ideal, or supplement with grow lights.\n\n- **Containers**: Use pots with drainage holes to prevent root rot. Terra cotta pots work well as they allow soil to breathe.\n\n- **Soil**: Use high-quality potting mix specifically for containers, not garden soil.\n\n- **Watering**: The most common mistake is overwatering. Most herbs prefer to dry slightly between waterings.\n\n- **Feeding**: Apply a diluted liquid fertilizer monthly during growing season.\n\nRegular harvesting actually encourages bushier growth, so don't be shy about snipping leaves for your cooking. Just avoid taking more than one-third of the plant at once.\n\nWith minimal space and care, you can enjoy fresh herbs year-round!",
    story: "Planting",
    date: "2025-07-18",
    files: ["/var/blog-images/1-herb-garden.jpg", "/var/blog-images/2-basil-plant.jpg", "/var/blog-images/3-harvesting-herbs.jpg"]
  },
  {
    _id: "jkl012",
    title: "Rust for JavaScript Developers: A Practical Introduction",
    text: "As a JavaScript developer who recently dove into Rust, I want to share my experience and some practical comparisons between these two languages. If you're coming from a JS background, Rust's concepts might initially seem foreign, but many translate surprisingly well.\n\nFirst, let's talk about why you might want to learn Rust:\n\n1. **Performance**: Rust programs run at speeds comparable to C/C++\n2. **Memory safety**: Rust's ownership system prevents common bugs without garbage collection\n3. **Concurrency without fear**: Thread safety is enforced at compile time\n4. **WebAssembly**: Rust is a top language for WASM, which JS developers are increasingly using\n\nHere's a simple comparison. In JavaScript, you might write:\n\n```javascript\nconst greeting = 'Hello, world!';\nconsole.log(greeting);\n```\n\nIn Rust, this becomes:\n\n```rust\nfn main() {\n    let greeting = \"Hello, world!\";\n    println!(\"{}\", greeting);\n}\n```\n\nThe biggest adjustment for JS developers is understanding Rust's ownership model. In JavaScript, you don't think twice about:\n\n```javascript\nlet a = [1, 2, 3];\nlet b = a;\na.push(4);\nconsole.log(b); // [1, 2, 3, 4]\n```\n\nBut in Rust, assignment moves ownership by default:\n\n```rust\nlet a = vec![1, 2, 3];\nlet b = a;\n// a is no longer valid here!\n```\n\nThis prevents a whole class of bugs but requires a mental shift.\n\nAnother key difference is Rust's strong, static typing versus JavaScript's dynamic typing. While TypeScript has bridged this gap somewhat, Rust's type system is more comprehensive and enforced at compile time.\n\nFor JavaScript developers, I recommend starting with simple CLI tools or algorithms in Rust before tackling more complex applications. The Rust Book (available free online) is an excellent resource.\n\nIn my next post, I'll show how to build a simple REST API in Rust that JavaScript developers will find familiar yet powerful.",
    story: "Programming",
    date: "2025-07-10",
    files: ["/var/blog-images/1-rust-vs-js.png", "/var/blog-images/2-code-comparison.jpg"]
  },
  {
    _id: "mno345",
    title: "Summer Vegetable Garden: Planning for Success",
    text: "With summer approaching, now is the perfect time to plan your vegetable garden for maximum harvest. After years of trial and error, I've developed a system that consistently produces abundant vegetables throughout the season.\n\nFirst, consider your growing zone and typical last frost date. I'm in Zone 7b, so I can safely plant warm-season crops by mid-April. Adjust your timeline based on your specific location.\n\nHere's my recommended planting schedule for a productive summer garden:\n\n**Early Summer (After Last Frost)**\n- Tomatoes (transplants)\n- Peppers (transplants)\n- Eggplant (transplants)\n- Cucumbers (direct sow)\n- Bush beans (direct sow)\n- Summer squash (direct sow)\n\n**Mid-Summer (2-3 weeks later)**\n- Succession plantings of bush beans\n- Okra (direct sow)\n- Sweet corn (direct sow)\n- Melons (direct sow)\n\n**Late Summer (for fall harvest)**\n- More bush beans\n- Fall cucumbers\n- Fast-maturing summer squash\n\nProper spacing is crucial for air circulation and disease prevention. I follow these guidelines:\n- Tomatoes: 24-36\" apart\n- Peppers and eggplant: 18-24\" apart\n- Cucumbers (trellised): 8-12\" apart\n- Bush beans: 4-6\" apart, rows 18\" apart\n- Summer squash: 24-36\" apart\n\nWatering consistently is key to preventing issues like blossom end rot and bitter cucumbers. I use drip irrigation on timers to deliver water directly to the soil, avoiding wet foliage which can promote disease.\n\nFor fertilizing, I start with compost-enriched soil and supplement with organic fertilizer at planting time. For heavy feeders like tomatoes, I add diluted fish emulsion every 2-3 weeks during the growing season.\n\nPest management is most effective when proactive. I interplant flowers like marigolds and nasturtiums to attract beneficial insects, and I inspect plants weekly for early signs of problems.\n\nWith proper planning and care, you can enjoy fresh vegetables all summer long!",
    story: "Planting",
    date: "2025-06-15",
    files: ["/var/blog-images/1-garden-layout.jpg", "/var/blog-images/2-tomato-plants.jpg"]
  },
  {
    _id: "pqr678",
    title: "Quick Weeknight Dinner: Thai-Inspired Coconut Curry",
    text: "On busy weeknights, I rely on this Thai-inspired coconut curry that comes together in just 30 minutes but tastes like it simmered all day. It's adaptable to whatever vegetables you have on hand, making it perfect for using up produce before your next grocery run.\n\nThis curry has become my go-to recipe when I want something flavorful, comforting, and quick. The combination of aromatic spices, creamy coconut milk, and fresh vegetables creates a restaurant-quality meal with minimal effort.\n\n**Ingredients (serves 4):**\n\n- 2 Tbsp vegetable oil\n- 1 onion, sliced\n- 3 cloves garlic, minced\n- 1 Tbsp ginger, grated\n- 2-3 Tbsp red curry paste (adjust to taste)\n- 1 red bell pepper, sliced\n- 1 zucchini, diced\n- 1 carrot, thinly sliced\n- 1 can (14 oz) coconut milk\n- 1 cup vegetable broth\n- 1 Tbsp soy sauce or fish sauce\n- 1 Tbsp brown sugar\n- Protein of choice: 1 lb tofu, chicken, or shrimp\n- Handful of spinach or kale\n- Fresh lime juice\n- Fresh basil or cilantro for garnish\n\n**Instructions:**\n\n1. Heat oil in a large pan over medium heat. Add onion and cook until softened, about 3-4 minutes.\n\n2. Add garlic and ginger, cooking for another minute until fragrant.\n\n3. Stir in curry paste and cook for 1-2 minutes to activate the spices.\n\n4. Add bell pepper, zucchini, and carrot. Stir to coat with curry paste.\n\n5. Pour in coconut milk and vegetable broth. Add soy sauce and brown sugar.\n\n6. Bring to a simmer and add your protein:\n   - For tofu: Add cubed, pressed tofu and simmer for 5 minutes\n   - For chicken: Add sliced chicken and simmer for 7-8 minutes until cooked through\n   - For shrimp: Add in the last 3-4 minutes of cooking until just pink\n\n7. Stir in greens and cook until just wilted.\n\n8. Finish with a squeeze of lime juice and adjust seasoning to taste.\n\n9. Serve over jasmine rice and garnish with fresh herbs.\n\nThe beauty of this recipe is its flexibility. Don't have zucchini? Use eggplant, green beans, or broccoli instead. The curry paste and coconut milk create a delicious base for whatever ingredients you have available.\n\nFor meal prep, this curry actually improves with time as the flavors meld, making it perfect for leftovers. It will keep in the refrigerator for 3-4 days or can be frozen for up to 3 months.\n\nEnjoy this quick, flavorful meal that brings a taste of Thailand to your weeknight dinner rotation!",
    story: "Cooking",
    date: "2025-06-05",
    files: ["/var/blog-images/1-thai-curry.jpg", "/var/blog-images/2-curry-ingredients.jpg"]
  }
];

// Insert the sample blogs
try {
  const result = db.blogs.insertMany(sampleBlogs);
  print(`Successfully inserted ${result.insertedCount} blog posts`);
  
  // Verify the data
  const count = db.blogs.countDocuments();
  print(`Total blogs in collection: ${count}`);
  
  // Print the titles of inserted blogs
  print("\nInserted blog posts:");
  db.blogs.find({}, {title: 1, story: 1}).forEach(blog => {
    print(` - ${blog.title} (${blog.story})`);
  });
  
} catch (error) {
  print(`Error inserting sample data: ${error.message}`);
}

print("\nSample data script completed!");
