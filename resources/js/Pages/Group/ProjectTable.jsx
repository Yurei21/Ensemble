import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import { Link, router } from "@inertiajs/react";

export default function GroupsTable({ project, members, queryParams = null }) {
    const projectId = project.id
    queryParams = queryParams || {}
    const searchFieldChanged = (name, value) => {
        if(value) {
            queryParams[name] = value
        } else {
            delete queryParams[name]
        }

        router.get(route('group.show'), queryParams)
    }

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;

        searchFieldChanged(name, e.target.value);
    }

    const removeMember = (groupId) => {
        if (!window.confirm("Remove this user from the group?")) return;

        router.visit(route("group.remove-member", [groupId, projectId]), {
            method: "delete",
            preserveScroll: true,
            preserveState: true,
        })
    }

    return (
        <>
            <div className="overflow-auto">
                <h1 className="text-xl font-bold mb-3">Group Members</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <th className="px-3 py-2">ID</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.name}
                                    placeholder="Group Name"
                                    onBlur={e => searchFieldChanged('name', e.target.value)}
                                    onKeyPress={e => onKeyPress('name', e)}
                                />
                            </th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.data.map(member => (
                            <tr key={member.id}>
                                <td>{member.id}</td>
                                <td className="text-white text-l font-bold">{member.name}</td>
                                <td>{member.email}</td>
                                <td>
                                    <button
                                        onClick={() => removeMember(member.id)}
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={members.meta.links}></Pagination>
        </>
    )
}