'use client'

import { useActionState } from 'react'
import { handleSubmitCheckout } from '@/app/actions/forms'

const CheckOut = () => {

    // renders the red <p> with {state.error} if there is an error, otherwise renders nothing.
    // the error is set in the handleSubmitCheckout server action which calls the checkOutItem function in lib/db.ts. 
    // If the item is already checked out, an error is thrown and caught here to display the error message to the user.
    const [state, formAction, pending] = useActionState(handleSubmitCheckout, null)

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm p-6 w-full">
          <h1 className="text-zinc-900 dark:text-white font-medium text-sm mb-4">Check Out Item</h1>
          <form action={formAction} className="flex flex-col gap-3">
            <input
              type="number"
              name="itemId"
              placeholder="Item ID"
              className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
            {state?.error && (
              <p aria-live="polite" className="text-sm text-red-500">{state.error}</p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-md px-4 py-2 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              Submit
            </button>
          </form>
        </div>
    )
}

export default CheckOut;
