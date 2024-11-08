import React, { useState, useEffect } from "react";
import axios from 'axios';
//add a filter by price
//add a way to see if column is sorted
//expandable rows in the table
//add form validator for total filter
const OrdersReport = () => {

    const [orders, setOrders] = useState([]);
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');    
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [waiters, setWaiters] = useState([]);
    const [selectedWaiter, setSelectedWaiter] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [totalOrders, setTotalOrders] = useState('');
    const [totalSales, setTotalSales] = useState('');
    const [totalTips, setTotalTips] = useState('');
    const [sortColumn, setSortColumn] = useState('');   
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);        // Tracks the current page
    const [selectedItemsPerPage, setSelectedItemsPerPage]= useState('5');
    const [totalPages, setTotalPages] = useState('');
    const [paginatedOrders, setPaginatedOrders] = useState([]);
    const [minTotal, setMinTotal] = useState(0);
    const [maxTotal, setMaxTotal] = useState(0);
    const itemsPerPage = 5;
    
    useEffect(()=>{
    const fetchdata = async () => {
        
        try {
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders_report`, {
                params: {
                    startDate,
                    endDate
                  }
            });
            if (response.data && response.data.success) {
                
                setOrders(response.data.orderData);
                setFilteredOrders(response.data.orderData);
                setWaiters(removeDuplicates(response.data.orderData.map(getWaiters)).sort());
                setTables(removeDuplicates(response.data.orderData.map(getTables)).sort())
                setTotalOrders(response.data.orderData.length);
                setTotalSales(calculateSum(response.data.orderData.map(getSales)));
                setTotalTips(calculateSum(response.data.orderData.map(getTips)));
                setTotalPages(Math.ceil(response.data.orderData.length / itemsPerPage));
                setPaginatedOrders(response.data.orderData);
                setMinTotal(Math.min(response.data.orderData.map(getSales)));
                setMaxTotal(Math.min(response.data.orderData.map(getSales)));
                
                
            } else {
                
                setOrders([]);
                setFilteredOrders([]);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setOrders([]);
            setFilteredOrders([]);
        }
        
    };
    fetchdata();
}, [startDate, endDate]);


useEffect(()=>{
    let min = document.getElementById("minTotalBar");
    min.value= 0;
    setMinTotal(0);
    let max = document.getElementById("maxTotalBar");
    max.value= 0;
},[]);
console.log(`Min: ${minTotal} Max: ${maxTotal}`)



   useEffect(()=>{
        console.log(waiters);
   },[waiters]);

    const getWaiters = (a) =>{
        return a.first_name;
    };
    const getSales = (a)=>{
        return parseFloat(a.total);
    };
    const getTips = (a)=>{
        return parseFloat(a.tip_amount);
    }
    const getTables =(a)=>{
        return a.table_number;
    };
    const removeDuplicates = (a)=>{
        return a.filter((item,index)=> a.indexOf(item)===index);
    };

    const calculateSum = (a)=>{
        return a.reduce((total,current)=>{
            return total + current;
        },0);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToFirstPage = () => setCurrentPage(1);

    const goToLastPage = () => setCurrentPage(totalPages);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    const handleWaiterChange = (e) => {
        setSelectedWaiter(e.target.value);
    };

    const handleTableChange = (e)=> {
        setSelectedTable(e.target.value);
    };

    const handleSort = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
    };

    const handlePageChange = (e) => {
        const pageNumber = parseInt(e.target.value);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleItemsPerPageChange = (e) =>{
        console.log("Change to " + e.target.value);
        setSelectedItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    }

    const handleEnter = (e) =>{
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            return false;
        }
    }

    const handleMinTotalBarChange = (e)=>{
        setMinTotal(e.target.value);
        setCurrentPage(1);
    }

    const handleMaxTotalBarChange = (e)=>{
        setMaxTotal(e.target.value);
        setCurrentPage(1);
    }

    const handleSumbitTotal = (e)=>{
        handleMinTotalBarChange(e);
        handleMaxTotalBarChange(e);
    }

    const isNumber = (e)=> {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
        
    }


    useEffect(()=>{
        let results = orders.filter(order=>{
        const query = searchQuery.toLowerCase();
        const orderTotal = order.total
        const minValid = isNaN(minTotal) || minTotal === '' || parseFloat(orderTotal) >= parseFloat(minTotal);
        const maxValid = isNaN(maxTotal) || minTotal === '' || parseFloat(orderTotal) <= parseFloat(maxTotal);
        const matchesSearchQuery = (
            order.order_id.toString().includes(query) ||
            order.customer_id?.toString().includes(query) ||
            order.table_number.toString().includes(searchQuery) ||
            order.first_name.toLowerCase().includes(query) ||
            (order.special_requests && order.special_requests.toLowerCase().includes(query))
        );
        const matchesWaiter = !selectedWaiter || (order.first_name).toLowerCase() === (selectedWaiter).toLowerCase();
        const matchesTable = !selectedTable || order.table_number === parseInt(selectedTable);
        
        
        return matchesSearchQuery && matchesWaiter && matchesTable && minValid && maxValid;
    });
        setTotalOrders(results.length);
        setTotalSales(calculateSum(results.map(getSales)));
        setTotalTips(calculateSum(results.map(getTips)));
        if (sortColumn) {
            results = results.sort((a, b) => {
                let aVal = a[sortColumn] !== null && a[sortColumn] !== undefined ? a[sortColumn] : '';
                let bVal = b[sortColumn] !== null && b[sortColumn] !== undefined ? b[sortColumn] : '';
                
                
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                }
                else {
                    return sortDirection === 'asc'
                        ? aVal.toString().localeCompare(bVal.toString())
                        : bVal.toString().localeCompare(aVal.toString());
                }
            });
        }
        setTotalPages(Math.ceil(results.length / selectedItemsPerPage));
        setFilteredOrders(results);
        setPaginatedOrders(results.slice(
            (currentPage-1) * selectedItemsPerPage,
            currentPage * selectedItemsPerPage
        ));
        
        
    }, [searchQuery, selectedWaiter, selectedTable, orders, sortColumn, sortDirection, selectedItemsPerPage, minTotal, maxTotal]);
    
    useEffect(()=>{
        //putting filteredOrders in this might cause a logic error
        setPaginatedOrders(filteredOrders.slice(
            (currentPage-1) * selectedItemsPerPage,
            currentPage * selectedItemsPerPage
        ));
        setTotalPages(Math.ceil(filteredOrders.length / selectedItemsPerPage));
    },[selectedItemsPerPage, currentPage])
    

    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
      };
    
      const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
    
        // Extracting components
        const year = date.getFullYear();
        const day = String(date.getDate()).padStart(2, '0'); // Pad with leading zero if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        // Constructing formatted string
        return `${year}-${day}-${month}, ${hours}:${minutes}:${seconds}`;
    };
    return (
        
        <div className="ordersGridContainer">
            <h1>Customer Orders Report</h1>
            <div className="dateFilter">
                <div className="dateInputs">
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                   
                </div>
            </div>
            <div className="orderSearch">
                <form>
                    <p>
                        <label for="searchBar">Search: </label>
                        <input type="text" name="searchBar" id="searchBar" placeholder="Search by Order ID, Customer ID, Table Number, etc." value={searchQuery} onChange={handleSearch} onKeyDown={handleEnter}></input>
                    </p>
                </form>

            </div>
            <div className="filterByWaiter">
                <lable for="watier">Filter By Waiter: </lable>
                <select name="waiter" value={selectedWaiter} onChange={handleWaiterChange}>
                    <option value="">Waiter Name's</option>
                    {waiters.map(waiter=>(
                        <option key={waiter} value={waiter}>
                    {waiter}</option>
                    )
                    )
                    }
                </select>
            </div>
            <div className="filterByTable">
                <label for="table">Table Number: </label>
                <select name="table" value={selectedTable} onChange={handleTableChange}>
                    <option value="">Table Number(s)</option>
                    {tables.map(table=>(
                        <option key={table} value={table}>
                    {table}</option>
                    )
                    )
                    }
                
                </select>
            </div>
            <div className="filterByTotal">
                <form>
                     
                    <span>
                        <label for="minTotalBar">Filter By Price Total: </label>
                        <input type="number"  name="minTotalBar" id ="minTotalBar" placeholder ="Minimum Total" min={0} max={maxTotal-1} onChange={handleMinTotalBarChange} onInput={isNumber} value={minTotal}/>
                    
                     
                    
                        <label for="maxTotalBar"> - </label>
                        <input type="number" name="maxTotalBar" id="maxTotalBar" placeholder ="Maximum Total" min={minTotal+1} onChange={handleMaxTotalBarChange} onInput={isNumber} value={maxTotal}/>
                    </span>
                    
                </form>
            </div>
            <div className="orderDis">
                <table>
                    <caption>Orders Table</caption>
                    <thead className = "orderInfo">
                        <tr>
                            <th onClick ={()=>handleSort('order_id')}>Order ID</th>
                            <th>Items Ordered</th>
                            <th onClick ={()=>handleSort('first_name')}>Waiter's Name</th>
                            <th onClick ={()=>handleSort('customer_id')}>Customer ID</th>
                            <th onClick ={()=>handleSort('subtotal')}>Subtotal</th>
                            <th onClick ={()=>handleSort('tip_percent')}>Tip (%)</th>
                            <th onClick ={()=>handleSort('tip_amount')}>Tip Amount</th>
                            <th onClick ={()=>handleSort('total')}>Total</th> 
                            <th onClick={()=>handleSort('table_number')}>Table Number</th>
                            <th>Time</th>
                            
                        </tr>
                    </thead>
                    <tbody className ="orderTable">
                        {paginatedOrders.map((order, key) => (
                            
                                <tr key={key}>
                                    <td>{order.order_id}</td>
                                    <td>{order.items.map(jsonItem=>(
                                        `${jsonItem.quantity} ${jsonItem.name}`)).join(', ')} 
                                    </td>
                                    <td>{order.first_name}</td>
                                    <td>{order.customer_id}</td>
                                    <td>{order.subtotal}</td>
                                    <td>{order.tip_percent}</td>
                                    <td>{order.tip_amount}</td>
                                    <td>{order.total}</td>
                                    <td>{order.table_number}</td>
                                    <td>{formatTimestamp(order.time)}</td>   
                                </tr>
                    
                        ))}
                    </tbody>
                    <tfoot>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Total Orders: {totalOrders}</th>
                        <th>Total Sales: {parseFloat(totalSales).toFixed(2)}</th>
                        <th>Total Tips: {parseFloat(totalTips).toFixed(2)}</th>
                    </tfoot>
                </table>
            </div>

            <div className="paginationControls">
                <label for="rowsPerPage">Rows Per Page</label>
                <select className="rowsPerPage" value={selectedItemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value="">Rows Per Page</option>
                    <option key={5} value={5}>5</option>
                    <option key={10} value={10}>10</option>
                    <option key={15} value={15}>15</option>
                    <option key={25} value={25}>25</option>
                </select>
                <button onClick ={goToFirstPage} disabled={currentPage ===1}>
                    First
                </button>
                <button onClick ={goToPreviousPage} disabled={currentPage ===1}>
                    Previous
                </button>
                <span>
                    Page <input type ="number" min="1" max={totalPages} value={currentPage} onChange={handlePageChange} /> 
                    of {totalPages}
                </span>

                <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
                <button onClick={goToLastPage} disabled={currentPage === totalPages}>
                    Last
                </button>

            </div>

        </div>  
    );

   
}
 
export default OrdersReport; 
/*
<td>{formatTimestamp(order.time)}</td> This is for formatting the time attribute
 <td>{order.item.map(jsonItem=>(
                                        `${jsonItem.quantity} (${jsonItem.name})`)).join('; ')} 
                                    </td> This is for how I want to display the items being purchased
                                    */