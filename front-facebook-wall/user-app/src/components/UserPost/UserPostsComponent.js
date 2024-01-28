import './UserPostsComponent.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';

export default function UserPostsComponent({ userName }) {
  const [postsWithLikes, setPostsWithLikes] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostSection, setShowNewPostSection] = useState(false);
  const [hubConnection, setHubConnection] = useState(null);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5221/Face_Book_App/user_name/${userName}/posts`);
      const fetchedPostsWithLikes = response.data;
      setPostsWithLikes(fetchedPostsWithLikes);
    } catch (error) {
      console.error('Error retrieving user posts:', error);
    }
  };

  useEffect(() => {
    const initializeSignalR = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5221/Like-Hub")
        .build();
  
      try {
        await connection.start();
        console.log("SignalR connected");
  
        connection.on("ReceiveLikesUpdate", (postId, likesCount) => {
          setPostsWithLikes((prevPosts) =>
            prevPosts.map((post) =>
              post.postId === postId ? { ...post, likeCount: likesCount } : post
            )
          );
        });
  
        setHubConnection(connection);
        fetchUserPosts();
      } catch (error) {
        console.error("Error starting SignalR connection", error);
      }
  
      return () => {
        connection
          .stop()
          .then(() => console.log("SignalR disconnected"))
          .catch((error) =>
            console.error("Error stopping SignalR connection", error)
          );
      };
    };
  
    initializeSignalR();
  }, []);
  


  const handleCreatePost = () => {
    const postData = {
      userName: userName,
      Header: newPostTitle,
      Description: newPostContent,
    };

    axios.post('http://localhost:5221/Face_Book_App/Create_New_Post', postData)
      .then(response => {
        console.log('Post created successfully:', response.data);
        setNewPostTitle('');
        setNewPostContent('');
        fetchUserPosts(); 
        setShowNewPostSection(false);
      })
      .catch(error => {
        console.error('Error creating post:', error);
      });
  };

  return (
    <div className="user-posts-container">
        <div className="user-posts">
        <h3>User Posts with Likes</h3>
        <ul>
            {postsWithLikes.map(post => (
            <li key={post.postId}>
                <p className="post-title">{post.header}</p>
                <p className="post-content">{post.description}</p>
                <p className="like-count">Likes: {post.likeCount}</p>
                <p className="post-time">Posted at: {post.postTime}</p>
            </li>
            ))}
        </ul>

        <button type="button" onClick={() => setShowNewPostSection(!showNewPostSection)}>
            {showNewPostSection ? 'Hide New Post Section' : 'Show New Post Section'}
        </button>

        </div>
      
      {showNewPostSection && (
        <div className="new-post-section">
            <h3>Create a New Post</h3>
            <label>
            Post Title:
            <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
            </label>
            <br />
            <label>
            Post Content:
            <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
            </label>
            <br />
            <button type="button" onClick={handleCreatePost}>
            Create Post
            </button>
        </div>
        )}
    </div>
  );
}
