✅ When categories should stay inside the Blog service

For most blog systems (like Medium, WordPress, Blogger):

Category belongs to blog content

Category rarely changes

Category is low-traffic

Category is tightly coupled with blog posts

Blog queries always need categories

So it’s MUCH simpler, faster, and safer to keep:

Blog Service
 ├── Posts
 ├── Categories
 └── Tags


This is the best approach 90% of the time.