import TaskList from "../components/TaskList";

const Dashboard = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🚀 TaskMaster Dashboard</h1>
      <TaskList />
    </div>
  );
};

export default Dashboard;