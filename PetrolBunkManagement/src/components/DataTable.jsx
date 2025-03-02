import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

const DataTable = ({ 
  buttonVariants, 

  data, 
  columns, 
  onEdit, 
  onDelete, 
  editingId = null,
  tableRowVariants,
  renderEditForm = null
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <AnimatePresence>
            {data.map((item, index) => (
              <motion.tr 
                key={item._id || index}
                custom={index}
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                {editingId === item._id && renderEditForm ? (
                  renderEditForm(item)
                ) : (
                  <>
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {column.render ? column.render(item) : item[column.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => onEdit(item._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => onDelete(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
