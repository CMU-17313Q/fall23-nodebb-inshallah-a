<h1> User Guide </h1>

<h2>1. Clone the Repository</h2>

<h2>2. Run dependencies</h2>

<h2>3. Run dependencies</h2>

<p> 1. Ensure you run the following command in a root directory in a terminal window: </p>

```
redis-server
```

<p>Optional: If you don't have redis installed, run the following command and do step 1 </p>

```
brew install redis
```

<p> 2. Ensure you're currently within the folder for 'fall23-nodebb-inshallah-a', then run the commands below seperatly </p>

<b> Keep pressing enter when encountering ./nodebb setup questions, only in the database question (Which database to use (mongo)) write 'redis' </b> 

```
./nodebb setup
```

```
./nodebb build
```

```
npm install eslint-config-nodebb --save-dev
```


```
sudo npm install -g grunt-cli
```

<p> 3. Start the server! </p>

```
grunt
```

After running grunt, the server will start locally! Access it through this [link](http://localhost:4567/)

Now register!

<h2> 4. Sprint 1 Features</h2>

<h2> 5. Sprint 2 Features</h2>

<h3> 1. Urgent Posts </h3>

When making topic in the comments and feedback category, you can select the '**Mark this post as URGENT**' button:


<img width="1257" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/39a860f4-b7d3-478b-9f8e-143b47dd38ea">


Once you do press the button, an alert confirms that you're sure that you want to proceed with this action!



<img width="1257" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/6a9768ba-a521-42f6-af5e-3332f34c730a">


Once you submit the form for a topic, you get notified!

<img width="1257" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/041d4a4e-0fd2-4edc-af7d-dcd909699e67">

Guess what!? When you go back to the Comment and Feedback category, it shows that your post is Urgent!!

<img width="1257" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/68da7005-189d-468d-b0f4-44695d8f6717">

This helps instructors know topics that must be resolved in a timely manner, where students in NodeBB only use the Urgent option when necessary. With great power, comes great responsibility. 

<h3> 2. Resolved Posts </h3>

From the prior step, you may have noticed, that the topic you just posted is marked as 'Unresolved', what can you do with that? That's our next feature! Press on your topic again!


Press on the 'Mark as Resolved' button!

<img width="1257" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/ef1c8dd5-3888-47ce-9f2e-37d34fce0c69">


Now when you go back to the comments and feedback category, guess what! The prior 'Unresolved' now shows as 'Resolved'! Yay!!

<img width="1257" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/72f230ab-4c43-4b17-b405-5e0ec0acdfb2">


