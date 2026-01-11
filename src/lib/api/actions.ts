"use server";

import { apiKeyService } from "./service";
import { revalidatePath } from "next/cache";

export async function createApiKeyAction(name: string) {
    const result = await apiKeyService.create(name);
    revalidatePath("/dashboard/settings");
    return result;
}

export async function revokeApiKeyAction(id: string) {
    await apiKeyService.revoke(id);
    revalidatePath("/dashboard/settings");
}

export async function getApiKeysAction() {
    return await apiKeyService.list();
}
