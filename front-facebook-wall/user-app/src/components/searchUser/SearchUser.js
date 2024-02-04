import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchUser.css";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function SearchUser({ userName }) {
  const [searchedUserName, setSearchedUserName] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const [hubConnection, setHubConnection] = useState(null);

  const handleSearchUser = () => {
    if (searchedUserName && searchedUserName !== userName) {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5221/Like-Hub", {
          withCredentials: true,
        })
        .build();

      connection
        .start()
        .then(() => {
          console.log("SignalR connected");

          connection.on("ReceiveLikesUpdate", (updatedUserName) => {
            console.log("Updated");
            handleSearchUser();
          });
        })
        .catch((error) => {
          console.error("Error starting SignalR connection", error);
        });

      setHubConnection(connection);

      axios
        .get(
          `http://localhost:5221/Face_Book_App/user_name/${searchedUserName}/posts`
        )
        .then((response) => {
          const fetchedUser = response.data;
          setSearchedUser(fetchedUser);
          setUserPosts(fetchedUser);
        })
        .catch((error) => {
          console.error("Error retrieving user posts:", error);
          setError("Error retrieving user posts");
        });
    }
  };
  const handleLikePost = (postId) => {
    const likePostUrl =
      "http://localhost:5221/Face_Book_App/Like_Post/?postId=" +
      postId +
      "&userName=" +
      userName;

    axios
      .post(likePostUrl)
      .then((response) => {
        const fetchedUser = response.data;
        handleSearchUser();
      })
      .catch((error) => {
        console.error("Error to give like", error);
        setError("Error to give like");
      });
  };

  return (
    <div>
      <h2>Search User</h2>
      <input
        type="text"
        placeholder="Enter username to search"
        value={searchedUserName}
        onChange={(e) => setSearchedUserName(e.target.value)}
      />
      <button onClick={handleSearchUser}>Search</button>

      {error && <p>{error}</p>}

      {searchedUser && (
        <div>
          <h3>{searchedUserName}'s Posts and Likes</h3>
          <div className="user-posts-container">
            {userPosts &&
              userPosts.map((post) => (
                <div key={post.postId} className="user-post">
                  <p className="post-header">{post.header}</p>
                  <p className="post-description">{post.description}</p>
                  <p className="post-time">Posted at: {post.postTime}</p>
                  <p className="like-count">Likes: {post.likeCount}</p>
                  <button
                    className="like-button"
                    onClick={() => handleLikePost(post.postId)}
                  >
                    Like
                  </button>
                  <hr />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
