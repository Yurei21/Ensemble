import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200 text-center">
                    Create Project
                </h2>
            }
        >

        </AuthenticatedLayout>
    )
}