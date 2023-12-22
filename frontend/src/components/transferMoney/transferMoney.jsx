import React, { useState, useEffect, useContext } from 'react';
import styles from './transferMoney.module.css';
import Payment_img from '../../assets/payment_img.jpeg';
import axios from 'axios';
import { UserContext } from '../../ctx/UserContextProvider';

function TransferMoney() {
  const { user, token } = useContext(UserContext);
  const [formData, setFormData] = useState({
    bankName: '',
    ifscCode: '',
    accountNo: '',
    amount: '',
    reference: '',
  });

  const [formErrors, setFormErrors] = useState({
    bankName: '',
    ifscCode: '',
    accountNo: '',
    amount: '',
    reference: '',
  });

  const [addedPayees, setAddedPayees] = useState([]);
  const [selectedPayee, setSelectedPayee] = useState(null);

  const [addPayeeForm, setAddPayeeForm] = useState({
    bankName: '',
    ifscCode: '',
    accountNo: '',
    accountType: '',
    payeeName: '',
  });

  const [addPayeeFormErrors, setAddPayeeFormErrors] = useState({
    bankName: '',
    ifscCode: '',
    accountNo: '',
    accountType: '',
    payeeName: '',
  });

  useEffect(() => {
    async function fetchPayees() {
      try {
        const userId = user._id;
        const response = await axios.get(`/api/payee/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //setProfiles(response.data);
        setAddedPayees(response.data);
      } catch (error) {
        console.error('Error fetching payees:', error);
      }
    }
    fetchPayees();
  }, [user._id, token]);

  const handleAddPayeeChange = (e) => {
    const { id, value } = e.target;
    setAddPayeeForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    setAddPayeeFormErrors((prevState) => ({
      ...prevState,
      [id]: '',
    }));
  };

  const handlePayeeRowClick = (payee) => {
    setSelectedPayee(payee);
    setFormData({
      ...formData,
      bankName: payee.bankName,
      ifscCode: payee.ifscCode,
      accountNo: payee.accountNo,
      reference: payee.payeeName,
    });
    window.scrollTo(0, 0);
  };

  const addNewPayee = async () => {
    try {
      const userId = user._id;
      const { bankName, ifscCode, accountNo, accountType, payeeName } = addPayeeForm;
      const data = {
        userId,
        bankName,
        ifscCode,
        accountNo,
        accountType,
        payeeName,
      };

      const response = await axios.post(`/api/payee/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Payee added successfully.');
      setAddedPayees([...addedPayees, response.data]);
      setAddPayeeForm({
        bankName: '',
        ifscCode: '',
        accountNo: '',
        accountType: '',
        payeeName: '',
      });
    } catch (error) {
      console.error('Error adding payee:', error);
      alert('Payee with same account number already exist.');
    }
  };

  const handleAddPayeeSubmit = (e) => {
    e.preventDefault();
    const newAddPayeeFormErrors = {};
    if (!addPayeeForm.bankName) {
      newAddPayeeFormErrors.bankName = 'Bank Name is required';
    }
    if (!addPayeeForm.accountNo) {
      newAddPayeeFormErrors.accountNo = 'Account Number is required';
    }
    if (!addPayeeForm.accountType) {
      newAddPayeeFormErrors.accountType = 'Account Type is required';
    }
    if (!addPayeeForm.payeeName) {
      newAddPayeeFormErrors.payeeName = 'Payee Name is required';
    }
    setAddPayeeFormErrors(newAddPayeeFormErrors);
    if (Object.keys(newAddPayeeFormErrors).length === 0) {
      addNewPayee();
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setFormErrors({ ...formErrors, [id]: '' });
  };

  const transferMoney = async () => {
    try {
      const userId = user._id;
      const { amount, accountNo, reference } = formData;

      if (amount <= 0) {
        alert('Invalid Amount.');
        return;
      }

      const data = {
        userId,
        receiverUserId: accountNo,
        amount,
        receiverName: reference,
      };

      await axios.post(`/api/transactions/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Payment Successful.');
      setFormData({
        bankName: '',
        ifscCode: '',
        accountNo: '',
        amount: '',
        reference: '',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error transferring money:', error);
      alert('Error transferring money.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.bankName) {
      newErrors.bankName = 'Bank Name is required';
    }
    if (!formData.ifscCode) {
      newErrors.ifscCode = 'IFSC Code is required';
    }
    if (!formData.accountNo) {
      newErrors.accountNo = 'Account Number is required';
    }
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    }
    if (!formData.reference) {
      newErrors.reference = 'Reference is required';
    }
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      transferMoney();
    }
  };

  return (
    <div className={styles.card}>
      <h2>Transfer Money</h2>
      <div className={styles.payment_form}>
        <div className={styles.form_img}>
          <img src={Payment_img} alt="" />
        </div>
        <div className={styles.form}>
          <h3>Pay</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.form_row}>
              <div className={styles.formGroup}>
                <label htmlFor="bankName">Bank Name</label>
                <input
                  type="text"
                  id="bankName"
                  placeholder="Enter Bank Name"
                  className={styles.formControl}
                  onChange={handleChange}
                  value={formData.bankName}
                />
                {formErrors.bankName && <div className={styles.error}>{formErrors.bankName}</div>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="ifscCode">IFSC Code</label>
                <input
                  type="text"
                  id="ifscCode"
                  placeholder="Enter IFSC Code"
                  className={styles.formControl}
                  onChange={handleChange}
                  value={formData.ifscCode}
                />
                {formErrors.ifscCode && <div className={styles.error}>{formErrors.ifscCode}</div>}
              </div>
            </div>
            <div className={styles.form_row}>
              <div className={styles.formGroup}>
                <label htmlFor="accountNo">Account Number</label>
                <input
                  type="text"
                  id="accountNo"
                  placeholder="Enter Account Number"
                  className={styles.formControl}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={handleChange}
                  value={formData.accountNo}
                />
                {formErrors.accountNo && <div className={styles.error}>{formErrors.accountNo}</div>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="amount">Amount</label>
                <input type="number" id="amount" placeholder="Enter Amount" className={styles.formControl} onChange={handleChange} />
                {formErrors.amount && <div className={styles.error}>{formErrors.amount}</div>}
              </div>
            </div>
            <div className={styles.form_row}>
              <div className={styles.formGroup}>
                <label htmlFor="reference">Payee Name</label>
                <input
                  type="text"
                  id="reference"
                  placeholder="Payee Name"
                  className={styles.formControl}
                  onChange={handleChange}
                  value={formData.reference}
                />
                {formErrors.reference && <div className={styles.error}>{formErrors.reference}</div>}
              </div>
            </div>
            <button className={styles.payButton} type="submit">
              Pay Now
            </button>
          </form>
        </div>
      </div>
      <div className={styles.payee}>
        <h4>Manage Beneficiaries</h4>
        <div className={styles.payee_list}>
          <div className={styles.existing_payee}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Bank</th>
                  <th>Account Type</th>
                  <th>Account Number</th>
                </tr>
              </thead>
              <tbody>
                {addedPayees.map((profile) => (
                  <tr key={profile._id} onClick={() => handlePayeeRowClick(profile)}>
                    <td>{profile.payeeName}</td>
                    <td>{profile.bankName}</td>
                    <td>{profile.accountType}</td>
                    <td>{profile.accountNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.add_payee}>
            <div className={styles.addpayee_form}>
              <h3>Add Payee</h3>
              <form onSubmit={handleAddPayeeSubmit}>
                <div className={styles.form_row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="bankName">Bank Name</label>
                    <input type="text" id="bankName" placeholder="Enter Bank Name" className={styles.formControl} onChange={handleAddPayeeChange} />
                    {addPayeeFormErrors.bankName && <div className={styles.error}>{addPayeeFormErrors.bankName}</div>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="ifscCode">IFSC Code</label>
                    <input type="text" id="ifscCode" placeholder="Enter IFSC Code" className={styles.formControl} onChange={handleAddPayeeChange} />
                    {addPayeeFormErrors.ifscCode && <div className={styles.error}>{addPayeeFormErrors.ifscCode}</div>}
                  </div>
                </div>
                <div className={styles.form_row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="accountNo">Account Number</label>
                    <input
                      type="text"
                      id="accountNo"
                      placeholder="Enter Account Number"
                      className={styles.formControl}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={handleAddPayeeChange}
                    />
                    {addPayeeFormErrors.accountNo && <div className={styles.error}>{addPayeeFormErrors.accountNo}</div>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="accountType">Account Type</label>
                    <input
                      type="text"
                      id="accountType"
                      placeholder="Enter Account Type"
                      className={styles.formControl}
                      onChange={handleAddPayeeChange}
                    />
                    {addPayeeFormErrors.accountType && <div className={styles.error}>{addPayeeFormErrors.accountType}</div>}
                  </div>
                </div>
                <div className={styles.form_row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="payeeName">Payee Name</label>
                    <input type="text" id="payeeName" placeholder="Enter Payee Name" className={styles.formControl} onChange={handleAddPayeeChange} />
                    {addPayeeFormErrors.payeeName && <div className={styles.error}>{addPayeeFormErrors.payeeName}</div>}
                  </div>
                </div>
                <button className={styles.payButton} type="submit">
                  Add Payee
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferMoney;
