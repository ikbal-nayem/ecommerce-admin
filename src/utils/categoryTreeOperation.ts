import { ICategoryPayload } from "services/api/products/Category.services";

export const parentTreeToLinear = (treeData: any) => {
	const result = [];

	const generateSubcategoryTree = (data, parent = []) => {
		data.forEach((item) => {
			parent.push(item.name);
			result.push({ id: item.id, slug: item?.slug, name: parent.join(" > ") });
			if (item.children.length) {
				generateSubcategoryTree(item.children, parent);
			}
			parent.pop();
		});
	};

	generateSubcategoryTree(treeData);
	return result;
};

export const productCountFromTree = (categoryTree: ICategoryPayload[]) => {
	categoryTree?.forEach((category: any) => {
		let childProductCount = category.children?.length
			? productCountFromTree(category.children)
			: 0;
		if (typeof childProductCount === "object") {
			childProductCount = childProductCount.reduce(
				(acc, curr) => acc + curr.productCount,
				0
			);
		}
		category.productCount = category.productCount + childProductCount;
	});
	return categoryTree;
};
