import { Table } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../../slices/usersApiSlice";

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();

  const navigate = useNavigate();

  return (
    <>
      <h1>All Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table hover responsive className="table-sm">
          <thead>
            <tr>
              <th>User Id</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>isAdmin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                style={{ cursor: "pointer" }}
              >
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
