import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currecntdPost, setCurrentPost] = useState(null);
  const [likesData, setLikesData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetchLikesData(selectedPost);
    }
  }, [selectedPost]);

  useEffect(() => {
    updateChart();
  }, [likesData]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5221/Face_Book_App/admin/all_posts"
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchLikesData = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:5221/Face_Book_App/admin/likes-per-day/${postId}`
      );
      setLikesData(response.data);
    } catch (error) {
      console.error("Error fetching likes data:", error);
    }
  };

  const updateChart = () => {
    const maxLikesIndex = likesData.findIndex(
      (day) =>
        day.likeCount === Math.max(...likesData.map((day) => day.likeCount))
    );

    const backgroundColors = Array(likesData.length).fill("aqua");
    backgroundColors[maxLikesIndex] = "red";

    setChartData({
      labels: likesData.map((day) => day.likedAt),
      datasets: [
        {
          label: "Most Liked Day",
          data: likesData.map((day) => day.likeCount),
          borderColor: "black",
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    });

    setChartOptions({});
  };

  const handlePostClick = (post) => {
    setSelectedPost(post.postId);
    setCurrentPost(post);
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h2>Admin Dashboard</h2>
        <div>
          <h3>All Posts</h3>
          {posts.length > 0 ? (
            <ul>
              {posts.map((post) => (
                <li key={post.postId} onClick={() => handlePostClick(post)}>
                  {post.header}
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>

      <div className="right-panel">
        {selectedPost && (
          <div>
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="post-container">
              <h3>{currecntdPost.header}</h3>
              <p>{currecntdPost.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
