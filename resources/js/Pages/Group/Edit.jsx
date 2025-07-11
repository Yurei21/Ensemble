import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react"
import Select from 'react-select';


export default function Edit({group, users}) {
    const {data, setData, post, errors, reset} = useForm({
        image: "",
        name: group.name ||"",
        status: group.status || "",
        description: group.description || "",
        due_date: group.due_date ||"",
        _method: "PUT",
    })

    const onSubmit = (e) => {
        e.preventDefault()
        
        post(route('group.update', group.id))
    }

    const userOptions = users.data.map((user) => ({
        value: user.id,
        label: user.name,
    }));


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200 text-center">
                    Edit Group "{group.name}"
                </h2>
            }
        >
            <Head title={`Edit Group "${group.name}"`} />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        {group.image_path && <div>
                            <img src={group.image_path} className="w-full h-80 object-cover"/>    
                        </div>}
                        <form onSubmit={onSubmit}className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div>
                                <InputLabel htmlFor="group_image_path" value="Group Image" />
                                <TextInput id="group_image_path" type="file" name="image" className="mt-1 block w-full" isFocused={true} onChange={e => setData('image', e.target.files[0])}/>
                                <InputError message={errors.image} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="group_name" value="Group Name" />
                                <TextInput id="group_name" type="text" name="text" value={data.name} className="mt-1 block w-full" isFocused={true} onChange={e => setData('name', e.target.value)}/>
                                <InputError message={errors.name} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="group_members" value="Group Members" />
                                <Select
                                    isMulti
                                    name="group_members"
                                    options={userOptions}
                                    className="basic-multi-select mt-1"
                                    classNamePrefix="select"
                                    onChange={(selected) =>
                                        setData('group_members', selected.map((opt) => opt.value))
                                    }
                                />
                                <InputError message={errors.group_members} className="mt-2" />
                            </div>
                            <div className="mt-4 text-right">
                                <Link href={route('group.index')} className="bg-gray-100 px-3 py-1.5 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">Cancel</Link>
                                <button className="bg-emerald-500 px-3 py-1 text-white rounded shadow transition-all hover:bg-emerald-600">Enter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}