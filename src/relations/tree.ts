import { Relation } from "./entity/relation.entity";

export interface TreeNode {
    id: string;
    parentId: string;
    children: TreeNode[];
}

export function buildTree(rows: Relation[]): TreeNode {
    const root: TreeNode = { id: "", parentId: "", children: [] };
    const nodeMap = new Map<string, TreeNode>();

    for (const row of rows) {
        if (!nodeMap.has(row.company_code)) {
            nodeMap.set(row.company_code, { id: row.company_code, parentId: row.parent_company, children: [] });
        } else {
            const existing = nodeMap.get(row.company_code)!;
            existing.parentId = row.parent_company;
        }
    }

    for (const node of nodeMap.values()) {
        if (!node.parentId) {
            root.children.push(node);
            continue;
        }
        const parent = nodeMap.get(node.parentId);
        if (parent) {
            parent.children.push(node);
        } else {
            root.children.push(node);
        }
    }

    return root;
}

export function trimTree(tree: TreeNode, codes: string[]): TreeNode {
    const codeSet = new Set(codes);

    const collect = (node: TreeNode): TreeNode[] => {
        const collectedChildren = node.children.flatMap((child) => collect(child));
        if (codeSet.has(node.id)) {
            return [{ ...node, children: collectedChildren }];
        }
        return collectedChildren;
    };

    return { id: "", parentId: "", children: collect(tree) };
}