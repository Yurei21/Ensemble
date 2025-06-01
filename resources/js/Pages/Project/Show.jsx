import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({project}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {`Project "${project.name}"`}
                </h2>
            }
        >
            <Head title={`Project "${project.name}"`} />

        </AuthenticatedLayout>
    )
}