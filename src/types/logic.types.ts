/**
 * Conditional Logic Types
 */

export type LogicOperator =
    | "equals"
    | "not_equals"
    | "contains"
    | "starts_with"
    | "ends_with"
    | "greater_than"
    | "less_than"
    | "is_empty"
    | "is_not_empty";

export type LogicActionType = "show" | "hide";

export interface LogicCondition {
    id: string;
    fieldId: string;
    operator: LogicOperator;
    value?: any; // Value to compare against
}

export interface LogicAction {
    id: string;
    fieldId: string; // Target field
    type: LogicActionType;
}

export interface LogicRule {
    id: string;
    name: string; // "Show Email if selected 'Contact Me'"
    matchType: "all" | "any"; // AND / OR
    conditions: LogicCondition[];
    actions: LogicAction[];
    enabled: boolean;
}

/**
 * The logic schema that will be attached to the form
 */
export interface FormLogic {
    rules: LogicRule[];
}
