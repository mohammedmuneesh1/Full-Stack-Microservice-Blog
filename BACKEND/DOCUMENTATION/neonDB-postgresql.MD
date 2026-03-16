import sql from './config/neonConnectDB.js';



async function initDB(){
  try {


    await sql `

    CREATE TABLE IF NOT EXISTS blogs(
      id SERIAL PRIMARY KEY,    
      title VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      blogContent TEXT NOT NULL,
      )`

      //id SERIAL PRIMARY KEY,     It ALREADY auto-increments. 
      //SERIAL in PostgreSQL creates an auto-incrementing integer
} catch (error) {
     throw new Error(String(error));
  }
}




      //id SERIAL PRIMARY KEY,     It ALREADY auto-increments. 
      //SERIAL in PostgreSQL creates an auto-incrementing integer

✔️ IF NOT EXISTS = One logical feature

But it is made of three separate words:

IF
NOT
EXISTS

Together they act as a single conditional check meaning:
“Only run this command if the thing does NOT already exist.”


It’s not one operator.
It’s a phrase that SQL treats as one condition.





//-- auto update of updatedAt field of postgresQl 

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_blog_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

/migrations/001_create_blogs.sql
/migrations/002_create_update_trigger.sql




//------------------------------------------------------------- CREATION  QUERY START -------------------------------------------------


    const result = await sql `INSERT INTO blogs
     (title,description,blogContent,image,category,author) 
     VALUES
      (${title},${description},${blogContent},${{url:cloudinaryResult.secure_url,publicId:cloudinaryResult.public_id}},
      ${category},${userId}) RETURNING *`;

    return ResponseHandler(res,200,true,result[0],'Blog created successfully');``



      ✔️ What RETURNING * does

          It returns the row you just inserted,
          Insert a new blog row
         Then return all columns of the inserted row


//------------------------------------------------------------- CREATION  QUERY END -------------------------------------------------

//------------------------------------------------------------- GET QUERY START -------------------------------------------------

  const blog = await sql `SELECT * FROM blogs WHERE id=${blogId}`;

//------------------------------------------------------------- GET QUERY END -------------------------------------------------

//------------------------------------------------------------- UPDATE QUERY START -------------------------------------------------

const updatedBlog = await sql `
 UPDATE
  blogs
 SET 
 title=${title || blogRows[0]!.title}
  ,description=${description || blogRows[0]!.description},
  blogContent=${blogContent || blogRows[0]!.blogContent},
  image=${newUpdatedImageResult ? JSON.stringify(newUpdatedImageResult) : blogRows[0]!.image
  },category=${category || blogRows[0]!.category} 
  WHERE
  id=${blogId}
   RETURNING 
   *`;
  
//------------------------------------------------------------- UPDATE QUERY END -------------------------------------------------
  
//------------------------------------------------------------- GET SEARCHTEXT QUERY START -------------------------------------------------

 const {searchQuery,category} = req.query;
    let blogs; 
    if(searchQuery && category){
        blogs = await sql `SELECT * FROM blogs WHERE title LIKE '%' || ${searchQuery} || '%' OR description LIKE '%' || ${searchQuery} || '%' AND category LIKE '%' || ${category} || '%' ORDER BY createdAt DESC LIMIT 10 `;
    }
    else if (searchQuery){
        blogs = await sql `SELECT * FROM blogs WHERE title LIKE '%' || ${searchQuery} || '%' OR description LIKE '%' || ${searchQuery} || '%' ORDER BY createdAt DESC LIMIT 10 `;
    }
    else if(category) {
        console.log("inside here");

        blogs = await sql `SELECT * FROM blogs WHERE category LIKE '%' || ${category} || '%'  ORDER BY createdAt DESC LIMIT 10 `;
    }
    else{
        blogs =await sql `SELECT * FROM blogs ORDER BY createdAt DESC LIMIT 10`;
    }

    

//------------------------------------------------------------- GET SEARCHTEXT QUERY END -------------------------------------------------





