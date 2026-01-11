import { formQueriesServer } from "@/lib/forms/queries";
import { submitFormAction } from "@/lib/submissions/actions";
import { redirect } from "next/navigation";
import { EmbedFormClient } from "@/components/embed/embed-form-client";
import type { FormSchema } from "@/types/form.types";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EmbedFormPage(props: PageProps): Promise<JSX.Element> {
    const { id } = await props.params;

    const form = await fetchForm(id);

    if (!form) {
        redirect("/");
    }

    const formSchema = form.schema as unknown as FormSchema;

    return (
        <EmbedFormClient
            formId={id}
            form={formSchema}
            onSubmit={async (data) => {
                "use server";
                return await submitFormAction(id, data);
            }}
        />
    );
}

async function fetchForm(id: string) {
    try {
        const form = await formQueriesServer.getById(id);

        if (!form || !form.is_public) {
            return null;
        }

        return form;
    } catch {
        return null;
    }
}
