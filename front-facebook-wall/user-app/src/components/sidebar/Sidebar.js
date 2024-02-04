import "./Sidebar.css";
export default function Sidebar({ myPostComponent, SearchUserComponent }) {
  const handleShowPosts = () => {
    myPostComponent();
  };

  const handleSearchUser = () => {
    SearchUserComponent();
  };

  return (
    <aside>
      <button onClick={handleShowPosts}>Show My Posts</button>
      <button onClick={handleSearchUser}>Search User</button>
    </aside>
  );
}
