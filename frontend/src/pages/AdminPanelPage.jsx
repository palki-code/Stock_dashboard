import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminPanelPage = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            const usersRes = await api.get('/auth/users');
            setUsers(usersRes.data);

            const transRes = await api.get('/transactions');
            setTransactions(transRes.data);
        } catch (error) {
            console.error('Failed to load admin data', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/transactions/${id}/status`, { status });
            loadAdminData(); // refresh list
        } catch (error) {
            alert('Error updating status');
        }
    };

    return (
        <div className="container">
            <h1>Admin Panel</h1>

            <div className="card">
                <h2>Pending Transactions for Approval</h2>
                {transactions.length === 0 ? <p>No transactions found.</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Symbol</th>
                                <th>Type</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t._id}>
                                    <td>{t.user?.name}</td>
                                    <td>{t.user?.email}</td>
                                    <td>{t.symbol}</td>
                                    <td style={{ color: t.type === 'buy' ? '#2ecc71' : '#e74c3c', textTransform: 'capitalize' }}>{t.type}</td>
                                    <td>{t.quantity}</td>
                                    <td>${t.price}</td>
                                    <td style={{ fontWeight: 'bold' }}>{t.status}</td>
                                    <td>
                                        {t.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button onClick={() => handleStatusUpdate(t._id, 'approved')} className="btn" style={{ backgroundColor: '#2ecc71', padding: '5px 10px' }}>Approve</button>
                                                <button onClick={() => handleStatusUpdate(t._id, 'rejected')} className="btn" style={{ backgroundColor: '#e74c3c', padding: '5px 10px' }}>Reject</button>
                                            </div>
                                        )}
                                        {t.status !== 'pending' && <span>N/A</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card">
                <h2>All Users</h2>
                {users.length === 0 ? <p>No users found.</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminPanelPage;
