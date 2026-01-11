"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, User, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { CreateOrgDialog } from "./create-org-dialog";
import type { OrganizationWithRole } from "@/types/organization.types";

interface OrgSwitcherProps {
    organizations: OrganizationWithRole[];
    currentOrgId: string | null;
}

export function OrgSwitcher({ organizations, currentOrgId }: OrgSwitcherProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Find current org name
    const currentOrg = organizations.find((o) => o.id === currentOrgId);
    const currentName = currentOrg ? currentOrg.name : "Personal Workspace";

    function handleSwitch(orgId: string | null) {
        const params = new URLSearchParams(searchParams);
        if (orgId) {
            params.set("orgId", orgId);
        } else {
            params.delete("orgId");
        }
        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                    >
                        <div className="flex items-center gap-2 truncate">
                            {currentOrgId ? (
                                <Users className="h-4 w-4 opacity-50" />
                            ) : (
                                <User className="h-4 w-4 opacity-50" />
                            )}
                            <span className="truncate">{currentName}</span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                    <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Personal Workspace */}
                    <DropdownMenuItem onClick={() => handleSwitch(null)}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 mr-2" />
                                Personal Workspace
                            </div>
                            {currentOrgId === null && <Check className="h-4 w-4" />}
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>

                    {organizations.map((org) => (
                        <DropdownMenuItem key={org.id} onClick={() => handleSwitch(org.id)}>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5">
                                        <AvatarFallback className="text-[10px]">
                                            {org.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate">{org.name}</span>
                                </div>
                                {currentOrgId === org.id && <Check className="h-4 w-4" />}
                            </div>
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Team
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateOrgDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </>
    );
}
