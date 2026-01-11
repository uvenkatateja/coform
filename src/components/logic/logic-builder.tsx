"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2 } from "lucide-react";
import type { FormField } from "@/types/form.types";
import type { FormLogic, LogicRule, LogicCondition, LogicAction, LogicOperator } from "@/types/logic.types";

interface LogicBuilderProps {
    fields: FormField[];
    logic: FormLogic;
    onChange: (logic: FormLogic) => void;
}

const OPERATORS: { value: LogicOperator; label: string }[] = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Does not equal" },
    { value: "contains", label: "Contains" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
];

export function LogicBuilder({ fields, logic, onChange }: LogicBuilderProps) {
    const [editingRule, setEditingRule] = useState<LogicRule | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const rules = logic?.rules || [];

    const handleSaveRule = (rule: LogicRule) => {
        let newRules = [...rules];
        const index = newRules.findIndex((r) => r.id === rule.id);

        if (index >= 0) {
            newRules[index] = rule;
        } else {
            newRules.push(rule);
        }

        onChange({ ...logic, rules: newRules });
        setIsDialogOpen(false);
        setEditingRule(null);
    };

    const handleDeleteRule = (id: string) => {
        const newRules = rules.filter((r) => r.id !== id);
        onChange({ ...logic, rules: newRules });
    };

    const openNewRule = () => {
        setEditingRule({
            id: crypto.randomUUID(),
            name: "New Rule",
            matchType: "all",
            conditions: [],
            actions: [],
            enabled: true,
        });
        setIsDialogOpen(true);
    };

    const openEditRule = (rule: LogicRule) => {
        setEditingRule({ ...rule }); // Clone to avoid mutation during edit
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Logic Rules</h3>
                <Button onClick={openNewRule} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                </Button>
            </div>

            <div className="space-y-3">
                {rules.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                        No rules defined. Click "Add Rule" to create dynamic behavior.
                    </div>
                ) : (
                    rules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                            <div>
                                <div className="font-medium flex items-center gap-2">
                                    {rule.name}
                                    {!rule.enabled && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">Disabled</span>}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    IF {rule.matchType === "all" ? "ALL" : "ANY"} of {rule.conditions.length} conditions match,
                                    THEN {rule.actions.length} actions.
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEditRule(rule)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)} className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {editingRule && (
                        <RuleEditor
                            rule={editingRule}
                            fields={fields}
                            onSave={handleSaveRule}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

interface RuleEditorProps {
    rule: LogicRule;
    fields: FormField[];
    onSave: (rule: LogicRule) => void;
    onCancel: () => void;
}

function RuleEditor({ rule: initialRule, fields, onSave, onCancel }: RuleEditorProps) {
    const [rule, setRule] = useState(initialRule);

    const addCondition = () => {
        setRule({
            ...rule,
            conditions: [
                ...rule.conditions,
                { id: crypto.randomUUID(), fieldId: "", operator: "equals", value: "" },
            ],
        });
    };

    const updateCondition = (index: number, updates: Partial<LogicCondition>) => {
        const newConditions = [...rule.conditions];
        newConditions[index] = { ...newConditions[index], ...updates };
        setRule({ ...rule, conditions: newConditions });
    };

    const removeCondition = (index: number) => {
        setRule({
            ...rule,
            conditions: rule.conditions.filter((_, i) => i !== index),
        });
    };

    const addAction = () => {
        setRule({
            ...rule,
            actions: [
                ...rule.actions,
                { id: crypto.randomUUID(), fieldId: "", type: "show" },
            ],
        });
    };

    const updateAction = (index: number, updates: Partial<LogicAction>) => {
        const newActions = [...rule.actions];
        newActions[index] = { ...newActions[index], ...updates };
        setRule({ ...rule, actions: newActions });
    };

    const removeAction = (index: number) => {
        setRule({
            ...rule,
            actions: rule.actions.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            <DialogHeader>
                <DialogTitle>{rule.name || "Edit Rule"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Rule Name</Label>
                    <Input
                        value={rule.name}
                        onChange={(e) => setRule({ ...rule, name: e.target.value })}
                        placeholder="e.g. Show Details if Yes"
                    />
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Conditions (IF)</Label>
                        <Select
                            value={rule.matchType}
                            onValueChange={(v: "all" | "any") => setRule({ ...rule, matchType: v })}
                        >
                            <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Match All (AND)</SelectItem>
                                <SelectItem value="any">Match Any (OR)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 border rounded-md p-4 bg-muted/20">
                        {rule.conditions.map((condition, index) => (
                            <div key={condition.id} className="flex gap-2 items-start">
                                <Select
                                    value={condition.fieldId}
                                    onValueChange={(v) => updateCondition(index, { fieldId: v })}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fields.map(f => (
                                            <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={condition.operator}
                                    onValueChange={(v: LogicOperator) => updateCondition(index, { operator: v })}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {OPERATORS.map(op => (
                                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {!["is_empty", "is_not_empty"].includes(condition.operator) && (
                                    <Input
                                        className="flex-1"
                                        placeholder="Value"
                                        value={condition.value}
                                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                                    />
                                )}

                                <Button variant="ghost" size="icon" onClick={() => removeCondition(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addCondition}>
                            <Plus className="h-4 w-4 mr-2" /> Add Condition
                        </Button>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <Label>Actions (THEN)</Label>
                    <div className="space-y-2 border rounded-md p-4 bg-muted/20">
                        {rule.actions.map((action, index) => (
                            <div key={action.id} className="flex gap-2 items-center">
                                <Select
                                    value={action.type}
                                    onValueChange={(v: "show" | "hide") => updateAction(index, { type: v })}
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="show">Show</SelectItem>
                                        <SelectItem value="hide">Hide</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={action.fieldId}
                                    onValueChange={(v) => updateAction(index, { fieldId: v })}
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select Field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fields.map(f => (
                                            <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button variant="ghost" size="icon" onClick={() => removeAction(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addAction}>
                            <Plus className="h-4 w-4 mr-2" /> Add Action
                        </Button>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onSave(rule)}>Save Rule</Button>
            </DialogFooter>
        </div>
    );
}
