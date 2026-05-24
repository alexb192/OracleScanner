import { handleSubmitItem } from '@/app/actions'

const CreateItem = async () => {
    
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm p-6 w-full">
          <h1 className="text-zinc-900 dark:text-white font-medium text-sm mb-4">Create Item</h1>
          <form action={handleSubmitItem} className="flex flex-col gap-3">
            <select
              name="device"
              className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              <option value="LAPTOP">Laptop</option>
              <option value="TABLET">Tablet</option>
            </select>
            <button
              type="submit"
              className="w-full text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-md px-4 py-2 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
    )
}

export default CreateItem;