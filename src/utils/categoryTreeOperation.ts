import { ICategoryPayload } from 'services/api/products/Category.services';

export const parentTreeToLinear = (treeData: any) => {
	const result = [];

	const generateSubcategoryTree = (data, parent = []) => {
		data.forEach((item) => {
			parent.push(item.name);
			result.push({ id: item._id, slug: item?.slug, name: parent.join(' > ') });
			if (item.subcategories?.length) {
				generateSubcategoryTree(item.subcategories, parent);
			}
			parent.pop();
		});
	};

	generateSubcategoryTree(treeData);
	return result;
};

export const productCountFromTree = (categoryTree: ICategoryPayload[]) => {
	categoryTree?.forEach((category: any) => {
		let childProductCount = category.subcategories?.length ? productCountFromTree(category.subcategories) : 0;
		if (typeof childProductCount === 'object') {
			childProductCount = childProductCount.reduce((acc, curr) => acc + curr.productCount, 0);
		}
		category.productCount = category.productCount || 0 + childProductCount;
	});
	return categoryTree;
};
