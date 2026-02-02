import { Relation } from "./interfaces/relation.interface";

export type TreeNode = {
    id: string;
    parentId: string;
    children: TreeNode[];
}

export function buildTree(rows: Relation[]): TreeNode {
    let relation = { id: "", parentId: "", children: [] };
    const childrenWithoutParent: TreeNode[] = [];
    for (const row of rows) {
        // Search by parent company code
        const foundPerentNode = find(row.parent_company, relation);
        const newChild = { id: row.company_code, parentId: row.parent_company, children: [] };

        if (row.parent_company === "") {
            relation = newChild;
        }

        // Find if exist parent in childrenWithoutParent array
        if (foundPerentNode) {
            addChild(newChild, foundPerentNode);
        } else {
            let foundParent = false;
            for (const child of childrenWithoutParent) {
                const found = find(row.parent_company, child)
                if (found) {
                    addChild(newChild, found);
                    foundParent = true;
                }

            }
            // Assert Children into parent Node
            if (!foundParent) childrenWithoutParent.push(newChild);
        }

        // Find all children node
        for (const child of childrenWithoutParent) {
            if (child.parentId === row.company_code) {
                addChild(child, newChild);
            }
        }
    }
    for (const branch of childrenWithoutParent) {
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