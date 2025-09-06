import React, { useEffect, useState, useMemo } from 'react';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
  MRT_TableOptions,
  MRT_RowSelectionState,
  MRT_Cell
} from 'material-react-table'
import { getlistCommentsStart } from '../../api/post/post.api';
import axios from 'axios';
import { MRT_Localization_VI } from 'material-react-table/locales/vi'
import { i18n } from '../../services/i18n'
import { RingLoader } from 'react-spinners';  // Import RingLoader from react-spinners
import { z } from 'zod';
import { Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material'

function isVietnamese () {
  return i18n.language === 'vi'
}

interface categoryproduct {
  id: number;
  ProductID: number;
  createdAt: string;
  content: string;
  status: string;
  feedback: string;  // Add feedback to the interface
}

const StarIcon = ({ full }: { full: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={full ? '#FFA500' : 'none'}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    style={{ width: '24px', height: '24px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

const Categoryproduct = () => {
  const [data, setData] = useState<categoryproduct[]>([]);
  const [filteredData, setFilteredData] = useState<categoryproduct[]>([]); // New state to store filtered data
  const [filter, setFilter] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Set loading to true before fetching data
      console.log('Fetching data...'); // Console log trước khi gọi API
  
      try {
        const response = await fetch('http://localhost:8000/api/v1/order/comments/all/start/all', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer your-jwt-token-value',  // Đảm bảo thêm token nếu cần
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
  
        const fetchedData = await response.json();
        console.log('API Response:', fetchedData); // Log toàn bộ response từ API
  

        console.log('Fetched Data:', fetchedData); // Log dữ liệu nhận được từ API
  
        setData(fetchedData);
        setFilteredData(fetchedData); // Initially, show all data
      } catch (error) {
        console.error('Server error:', error);  // In ra lỗi chi tiết
        console.error('Error fetching data:', error);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
        console.log('Data fetching completed'); // Console log khi hoàn thành fetching
      }
    };
  
    fetchAllData();
  }, []);
  const filteredProductData = useMemo(() => {
    return filteredData.filter((item) => {
      // Kiểm tra xem ProductName có tồn tại và là chuỗi không
      return item.ProductID && item.ProductID.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [filteredData, searchQuery]);
  
  
  
  const reviewSummary = useMemo(() => {
    const totalReviews = filteredProductData.length;
    const feedbackStates = [
      { key: 'Hài lòng', label: 'Hài lòng' },
      { key: 'Không hài lòng', label: 'Không Hài lòng' },
      { key: 'Trung lập', label: 'Trung lập' },
      { key: 'Vừa khen vừa chê', label: 'Vừa khen vừa chê' },
      { key: 'Mỉa mai', label: 'Mỉa mai' },
      { key: 'Gợi ý', label: 'Gợi ý' },
      { key: 'Không xác định', label: 'Không xác định' },
    ];
  
    return feedbackStates.map((state) => {
      const count = filteredProductData.filter((item) => item.feedback === state.key).length;
      const percentage = totalReviews ? ((count / totalReviews) * 100).toFixed(1) : '0.0';
      return {
        ...state,
        count,
        percentage,
      };
    });
  }, [filteredProductData]);

  const handleFilterChange = (selectedStatus: string) => {
    setFilter(selectedStatus);

    const filtered =
      selectedStatus === ''
        ? data
        : data.filter((item) => item.feedback === selectedStatus); // Filter by feedback

    setFilteredData(filtered); // Update filtered data
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    return (
      <div style={{ display: 'flex' }}>
        {Array.from({ length: fullStars }, (_, index) => (
          <StarIcon key={index} full={true} />
        ))}
      </div>
    );
  };

  const formatDateForDatetimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}`;
    const day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
    const hours = `${date.getHours() < 10 ? '0' : ''}${date.getHours()}`;
    const minutes = `${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const columns = useMemo<Array<MRT_ColumnDef<categoryproduct>>>(() => [
    {
      accessorKey: 'ProductID',
      header: 'Tên sản phẩm',
      size: 120,
    },
     {
                       accessorKey: 'content',
                       header: 'Nội dung đánh giá',
                       enableEditing: true,
                       grow: true,
                       size: 200,
                       enableGlobalFilter: false,
                       Cell: ({ cell }: { cell: MRT_Cell<categoryproduct> }) => {
                         const description = cell.getValue<string>()
                         const maxLength = 70
                         return (
                           <div>
                             {description.length > maxLength
                               ? (
                               <Tooltip title={description}>
                                 <span>{`${description.substring(0, maxLength)}...`}</span>
                               </Tooltip>
                                 )
                               : (
                                   description
                                 )}
                           </div>
                         )
                       }
                     },
    {
      accessorKey: 'number_star',
      header: 'Sao đánh giá',
      size: 120,
      Cell: ({ row }) => <StarRating rating={row.original.number_star} />,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 120,
    },
    {
      accessorKey: 'createdAt',
      header: 'Thời gian đánh giá',
      Cell: ({ cell }) => formatDateForDatetimeLocal(cell.getValue<string>()),
      size: 120,
    },
    {
      accessorKey: 'feedback',
      header: 'Trạng thái',
      size: 120,
    },
  ], []);
  const table = useMaterialReactTable({
    columns,
    data: filteredProductData,
    enableGlobalFilter: true, // Kích hoạt thanh tìm kiếm toàn cục
    globalFilter: searchQuery,  // Truyền giá trị tìm kiếm
    onGlobalFilterChange: (value) => setSearchQuery(value), // Chỉ cần giá trị tìm kiếm từ event
    paginationDisplayMode: 'pages',
    enableRowSelection: false,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 1 },
      sorting: [{ id: 'id', desc: true }],
      columnVisibility: {
        id: false,
        'mrt-row-actions': false, // Ẩn cột hành động
      },
    },
    positionToolbarAlertBanner: 'top',
    enableFilterMatchHighlighting: false,
    getRowId: (row: categoryproduct) => row.id.toString(),
    editDisplayMode: 'row',
    enableEditing: true,
    autoResetPageIndex: false,
    localization: isVietnamese() ? MRT_Localization_VI : undefined,
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
        fontStyle: 'bold',
        fontWeight: 'bold',
      },
      align: 'center',
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
      },
      align: 'center',
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        enableResizing: false,
        size: 0,
        grow: false,
        enableColumnActions: false,
        enableEditing: false,
        enableSorting: false,
        header: '',
      },
      'mrt-row-numbers': {
        enableResizing: true,
        size: 40,
        grow: false,
      },
    },
    enableRowNumbers: false,
    layoutMode: 'grid',
  });
  
  
  return (
    <div>
      <div className="py-10 px-5 w-full">
        <div className="flex mb-8 space-x-8">
          {/* First Section: Filter */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
              Phân tích sản phẩm từ khách hàng
            </h1>
            <div className="mb-4">
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Hài lòng">Hài lòng</option>
                <option value="Không hài lòng">Không hài lòng</option>
                <option value="Trung lập">Trung lập</option>
                <option value="Vừa khen vừa chê">Vừa khen vừa chê</option>
                <option value="Mỉa mai">Mỉa mai</option>
                <option value="Gợi ý">Gợi ý</option>
                <option value="Không xác định">Không xác định</option>
              </select>
            </div>
          </div>

          {/* Second Section: Product Rating */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Tỉ lệ đánh giá sản phẩm</h1>
            {reviewSummary.map((item, index) => (
              <div key={index} className="w-full h-6 bg-gray-200 rounded-lg overflow-hidden mt-4 relative">
                <div className="absolute inset-0 flex items-center justify-between px-2 z-10">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-400">
                    {item.count}/{filteredProductData.length} ({item.percentage}%)
                  </span>
                </div>
                <div
                  className="absolute inset-0 bg-yellow-300 rounded"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="my-4" />
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <RingLoader color="#FFA500" size={80} /> {/* Stylish loading spinner */}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      )}
    </div>
  );
};

export default Categoryproduct;
