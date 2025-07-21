import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({
  auth,
  totalPendingTasks,
  myPendingTasks,
  totalProgressTasks,
  myProgressTasks,
  totalCompletedTasks,
  myCompletedTasks,
  activeTasks,
}) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-bold text-3xl text-gray-800 dark:text-gray-100">
          Welcome back, {auth.user.name} 👋
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-10 px-4 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Pending Tasks"
            count={myPendingTasks}
            total={totalPendingTasks}
            color="amber"
          />
          <StatCard
            title="In Progress"
            count={myProgressTasks}
            total={totalProgressTasks}
            color="blue"
          />
          <StatCard
            title="Completed"
            count={myCompletedTasks}
            total={totalCompletedTasks}
            color="green"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              🧠 My Active Tasks
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {activeTasks.data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                      No active tasks 🎉
                    </td>
                  </tr>
                ) : (
                  activeTasks.data.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4">{task.id}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={route("project.show", task.project.id)}
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {task.project.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={route("task.show", task.id)}
                          className="hover:underline text-white"
                        >
                          {task.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${TASK_STATUS_CLASS_MAP[task.status]}`}
                        >
                          {TASK_STATUS_TEXT_MAP[task.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">{task.due_date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function StatCard({ title, count, total, color }) {
  const colors = {
    amber: "text-amber-500 bg-amber-100 dark:bg-amber-900",
    blue: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    green: "text-green-500 bg-green-100 dark:bg-green-900",
  };

  return (
    <div className={`rounded-2xl shadow-md p-6 bg-white dark:bg-gray-800`}>
      <h4 className={`text-xl font-semibold ${colors[color]}`}>{title}</h4>
      <p className="text-2xl mt-3 font-bold text-gray-800 dark:text-white">
        <span>{count}</span>
        <span className="text-lg text-gray-500 dark:text-gray-400">
          {" "}
          / {total}
        </span>
      </p>
    </div>
  );
}
