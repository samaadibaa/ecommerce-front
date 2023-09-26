import Header from "@/components/Header";
import Center from "@/components/Center";
import {Category} from "@/models/Category";


export default function CategoriesPage({categories}) {
  return (
    <>
      <Header />
      <Center>
        {categories.map(cat => (
          <div>
            <h2>{cat.name}</h2>
          </div>
        ))}
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  const categories = await Category.find();
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
