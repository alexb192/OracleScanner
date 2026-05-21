import { fetchItems } from '@/app/lib/db'
import ItemsTableClient from './items_table_client'

const Items = async () => {
    const items = await fetchItems();
    return <ItemsTableClient items={items} />
};

export default Items;
