
import {useEffect, useRef, useState} from 'react';
import IItem from '../models/IItem';
import { getItems, postItem } from '../services/items';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';


const ExpenseTracker = () =>{

    const [items, setItems] = useState<IItem[]>([]);
    const [status, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [show, setShow]=useState(false);

    const payeeNameRef = useRef<HTMLSelectElement | null>(null);
    const priceRef = useRef<HTMLInputElement | null>(null);
    const productRef = useRef<HTMLInputElement | null>(null);

    

    const fetchItems = async () =>{
        const items = await getItems();
        setItems( items )
        setLoading( false)
    }

    const personalExpense = (payeeName: string) => {
        return items.filter(i => i.payeeName === payeeName)
        .reduce(( acc, i )=>
            acc + i.price, 0
        )
    }

    const getPayable = () =>{

        const rahulPaid = Math.abs(personalExpense('Rahul'));
        const ramehsPaid = Math.abs(personalExpense("Ramesh"))
        return {
            payableAmount: rahulPaid-ramehsPaid/2,
            message: rahulPaid <ramehsPaid ? 'Rahul has to Pay' : 'Ramehs has to Pay'
        }
    }

    const handleShow = () =>{
            setShow(true)
    }

    const handleClose = () =>{
        setShow(false)
    }

    useEffect(
        ()=>{
            fetchItems();
        },[]
    )

    const addItem = async () => {
        const item = {
            payeeName: payeeNameRef.current?.value || '',
            price: parseInt( priceRef.current?.value || '0' ),
            product: productRef.current?.value || '',
            setDate: (new Date()).toISOString().substr( 0, 10 )
        };

        const newItem = await postItem( item );

        setItems(
            [
                ...items,
                newItem
            ]
        );
        
        setShow( false );
    }

    return (
        <Container className='my-4'>
            <h1>Expense Tracker
            <Button variant='primary float-end' onClick={handleShow} style={{marginBottom:"2px"}}>Add an Item</Button>
            </h1>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add an item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="payeeName">
                            <Form.Label>Who paid?</Form.Label>
                            <Form.Select aria-label="Default select example" ref={payeeNameRef}>
                                <option value="">Select one</option>
                                <option value="Rahul">Rahul</option>
                                <option value="Ramesh">Ramesh</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="price"
                        >
                            <Form.Label>Expense amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="How much was spent? (Rs.)"
                                ref={priceRef}
                            />
                        </Form.Group>
                        
                        <Form.Group
                            className="mb-3"
                            controlId="product"
                        >
                            <Form.Label>Describe the expense</Form.Label>
                            <Form.Control
                                placeholder="How much was spent? (Rs.)"
                                ref={productRef}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addItem}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <hr/>

            
            
            <Table striped bordered hover size='sm'>
                <thead>
                    <tr>
                    <th>Payee</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map((rowData, i) =>{
                            return (
                            <tr key={i}>
                            <td>{rowData.payeeName}</td>
                            <td>{rowData.setDate}</td>
                            <td>{rowData.product}</td>
                            <td className='text-end'>{rowData.price}</td>
                            </tr>
                     
                            )
                        })
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>Total amount spent by Rahul</td>
                        <td className='text-end'>{personalExpense('Rahul')}</td>
                    </tr>
                    <tr>
                        <td colSpan={3}>Total amount spent by Ramesh</td>
                        <td className='text-end'>{personalExpense('Ramesh')}</td>
                    </tr>
                    <tr>
                        <td colSpan={3}>{getPayable().message}</td>
                        <td className='text-end'>{getPayable().payableAmount}</td>

                    </tr>
                </tfoot>
            </Table>
        </Container>
    )

}


export default ExpenseTracker