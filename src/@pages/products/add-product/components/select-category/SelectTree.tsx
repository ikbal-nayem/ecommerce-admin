import WxCheckbox from "@components/Checkbox";

type SelectTreeProps = {
  data?: any[];
  isChild?: boolean;
  selectedCategory?: any;
  setCategory?: Function;
};

const SelectTree = ({
  data=[],
  isChild = false,
  setCategory,
  selectedCategory,
}: SelectTreeProps) => {

  return (
    <ul className={`${isChild ? "child" : "parent"}`}>
      {data.map((sub) => {
        if (!sub?.isActive) return;
        if (sub.children.length) {
          return (
            <li key={sub.slug}>
              <WxCheckbox
                id={sub.id}
                label={sub.name}
                onChange={() => setCategory(sub)}
                checked={selectedCategory.id === sub.id}
              />
              <SelectTree
                data={sub.children}
                selectedCategory={selectedCategory}
                setCategory={setCategory}
                isChild
              />
            </li>
          );
        }
        return (
          <li key={sub.slug}>
            <WxCheckbox
              id={sub.id}
              label={sub.name}
              onChange={() => setCategory(sub)}
              checked={selectedCategory.id === sub.id}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default SelectTree;
