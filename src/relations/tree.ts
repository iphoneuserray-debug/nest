import { Relation } from "./entity/relation.entity";

export type TreeNode = {
    id: string;
    parentId: string;
    children: TreeNode[];
}

export function buildTree(rows: Relation[]): TreeNode {
    const relation = { id: "", parentId: "", children: [] };
    const nodes: TreeNode[] = [];
    for (const row of rows) {
        // Search by parent company code
        const foundPerentNode = find(row.parent_company, relation);
        const newChild = { id: row.company_code, parentId: row.parent_company, children: [] };

        if (row.parent_company === "") {
            addChild(newChild, relation);
        }
        // Find if exist parent in nodes array
        else if (foundPerentNode) {
            addChild(newChild, foundPerentNode);
        }
        else {
            let foundParent = false;
            for (const node of nodes) {
                const found = find(row.parent_company, node)
                if (found) {
                    addChild(newChild, found);
                    foundParent = true;
                }

            }
            // Assert Children into parent Node
            if (!foundParent) nodes.push(newChild);
        }

        // Find all children node
        for (const child of nodes) {
            if (child.parentId === row.company_code) {
                addChild(child, newChild);
            }
        }
    }
    for (const branch of nodes) {
        addChild(branch, relation)
    }
    return relation;
}

function find(id: string, tree: TreeNode): TreeNode | null {
    if (tree.id === id) {
        return tree;
    }
    for (const child of tree.children) {
        const result = find(id, child);
        if (result) return result;
    }
    return null;
}

function addChild(child: TreeNode, tree: TreeNode): void {
    tree.children.push(child);
}