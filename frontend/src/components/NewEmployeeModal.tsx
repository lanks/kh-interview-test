import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Employee from '../resources/Employee';
import { useForm } from "react-hook-form"
import { CollectionProxy } from 'spraypaint/lib-esm/proxies';
import Department from '../resources/Department';


interface NewEmployeeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  departments?: CollectionProxy<Department>
}
const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({ departments, open, setOpen }: NewEmployeeModalProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
    reset,
  } = useForm<Employee>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: new Employee()
  });

  const onFormSuccess = async (data: Employee) => {
    // Scrub data for actual mutation
    //@TODO The actual update
    const success = await data.save();
    if(success) { 
      reset(new Employee());
      setOpen(false)
    } else {
      
    }
  }

  const onFormError = async () => {
  }
  const isPersonInDepartment = async (departmentId: number): Promise<boolean> => {
    const firstName = getValues('firstName');
    const lastName = getValues('lastName');
    const employees = await Employee.where({ firstName, lastName, departmentId }).all();
    return (employees.data?.length ?? 0) > 0;
  }
  
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center min-h-full p-4 text-left sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <form
              onSubmit={handleSubmit(onFormSuccess, onFormError)}
            >
            <div>
              <div className="mt-3 text-left sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  New Employee
                </DialogTitle>
                <div className="mt-2">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age
                      </label>
                      <input
                        type="number"
                        {...register('age', { 
                          required: 'Age is required'
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.age && (
                        <p className="mt-2 text-sm text-red-600">{errors.age.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                        Position
                      </label>
                      <input
                        type="text"
                        {...register('position', { required: 'Position is required' })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.position && (
                        <p className="mt-2 text-sm text-red-600">{errors.position.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <select
                        {...register('departmentId', { 
                          required: 'Department is required',
                          validate: {
                            isPersonInDepartment: async (value) => {
                              const result = await isPersonInDepartment(value);
                              return !result || 'The employee already exists in this department.';
                            }
                          }
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select a department</option>
                        {departments?.data.map((department: {id: string|number, name: string}) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                      {errors.departmentId && (
                        <p className="mt-2 text-sm text-red-600">{errors.departmentId.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
              >
                Submit
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              >
                Cancel
              </button>
            </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
export default NewEmployeeModal;
