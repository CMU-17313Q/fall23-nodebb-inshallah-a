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
npm install lodash --save
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

<h3> 1. Private Posts </h3>

Upon pressing on the 'New Topic' button, you notice a 'Private' dropdown, fill it out, and let's see what happens with this 'Private' post :)

<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/fda5efc8-8a26-4556-928f-c5e650b1a43a">

<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/9fada2f2-a5f7-4b6a-b01f-13fe41585af8">

Now switch to another account, here we're switching to student1, we were in student2. Feel free to register another student account to see our feature!

Oh look! We can't see the other student's private post!

<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/c027fbe7-f645-475b-83ec-9dbf3666dd85">


But what happens if we switch to an instructor, what happens then? Instructors can see private posts. This is because private posts are directed to them
if students wish to personal questions, or ask questions about their code!

As an instructor we can see the student's private post! Only the student that posted the private post, or an instructor can see the private post. 

<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/d5a037fb-d601-408f-a318-f5b049523027">


<h3> 2. Anonymous Posts </h3>

Let's go back to the student account, and create another topic! This time you might notice the 'Anonymous' selection, let's keep it as Anonymous, and change Private to be
'Non Private', and see what happens!


<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/f6d5f711-8cc9-40bf-b6ae-c8b07efb07d0">


Now as you can see, given that you made the topic, you can see your name, and you can see your beautiful icon!

<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/d3e0c7c1-b0a7-4b99-83a2-16370ec34673">


But let's see what happens when we switch to another student's account! Oh look! You can't see the student's name or their icon!

<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/da416e82-9c1f-4a4b-9722-7f64496a90c6">

If you click on a topic as well, check out what happens, it's all anonymous!

<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/3b35d231-8198-4b77-85ba-ee0f7163f7ac">

But an instructor should see whoever posts a topic, and this it to make sure that a student's participation is tracked!

Well look at that, you can see the anonymous post from the student! This encourages not to shy away from asking a question, and provides this
through being anonymous if they'd like!

<img width="1439" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/633377a7-7fd5-44c6-9ae9-5eb87a56116a">



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


<h2> Tests in Sprint 2 </h2>

<h3> isUrgent attribute </h3>

In sprint 2 we added the isUrgent feature as seen above, but to accomplish this, we had to write an automated test first. The process of making this feature work involved ensuring that the attribute exists no matter what. Thus through pull request [#71](https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/pull/71)

This testing is sufficient because the changes made include adding the isUrgent attribute. The test does not test for if isUrgent is boolean or string. This is because in redis, booleans are stored as string, and in other databases booleans are type booleans. 

<img width="517" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/9fae00c5-855a-4405-b4c3-69d40145853a">

<h3> isResolved attribute </h3>

In sprint 2 we added the isResolved feature as seen above, but to accomplish this, we had to write an automated test first. The process of making this feature work involved ensuring that the attribute exists no matter what. Thus through pull request [#72](https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/pull/72)

This testing is sufficient because the changes made include adding the isUrgent attribute. The test does not test for if isUrgent is boolean or string. This is because in redis, booleans are stored as string, and in other databases booleans are type booleans. 

<img width="761" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/69cb5aa3-fe95-4b7f-8f7a-f7a6ae1c9185">

<h3> isResolved frontend-backend connection </h3>

In sprint 2, we had to update the isResolved, this required setting up routing that updated the isResolved database attribute from being false to being true. This involved the addition of the testing required for the isResolved connection, and this accomplishes the testing of the required issue. This fulfills the acceptance criteria because it involves first ensuring that the isResolved is by default false upon topic creation. It then ensures that upon calling functionality that is the same as the route, that the isResolved updates to true immediatlly. This is possible through the use of AJAX, ensuring there's no need to refresh the page. This test passed, and thus the acceptance criteria is fulfilled! This was linked to pull request [#86](https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/pull/86)

<img width="1093" alt="image" src="https://github.com/CMU-17313Q/fall23-nodebb-inshallah-a/assets/122257080/48bdcc9a-3455-4ee8-84ee-a40f98b1080e">


