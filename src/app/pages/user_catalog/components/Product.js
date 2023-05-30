import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../styles/product.css'

function Product() {
    const [product, setProduct] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        tags: '',
        status: '',
    });

    useEffect(() => {
        fetch(`http://localhost:8000/product`)
            .then(response => response.json())
            .then(data => {
                setProduct(data); // Validar
                setLoading(false);
            });
    }, []);

    const editProduct = () => {
        axios.post(`http://localhost:8000/product/${id}`, formData)
            .then(response => {
                console.log(response);
                setProduct(response.data);
                setEditModalOpen(false); // Cerrar el modal después de editar
            })
            .catch(error => console.error('Error:', error));
    }

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const deleteProduct = () => {
        axios.delete(`http://localhost:8000/product/${id}`) // Verificar
            .then(response => {
                console.log(response);
                // Aquí puedes redirigir al usuario, actualizar el estado global, etc.
                setEliminarModalAbierto(false); // Cerrar el modal después de eliminar
            })
            .catch(error => console.error('Error:', error));
    }

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    return (
        <div className="product-page-container">
            <div className="product-general-information-container"> 
                <div className="small-image-container">
                    <img className="product-image-small" src={product.image}></img>
                </div>
                <div className="price-name-container">
                    <h1 className="product-name"> {product.title} </h1>
                    <span className="product-price">{product.price.amount}</span>
                </div>
                <div className="product-user-actions-container">
                    <input type="button" className="view-details">Ver detalles</input>
                </div>
            </div>
            <div className="product-admin-actions-container"> {/* Esto se muestra solo si es usuario logueado es admin */}
                <input type="button" className="edit-product" onClick={() => setEditModalOpen(true)}>Editar producto</input>
                <input type="button" className="delete-product" onClick={() => setDeleteModalOpen(true)}>Eliminar producto</input>
            </div>
            <div className="view-detail-modal"> {/* Esto se muestra si se hizo click en botón ver detalles*/}
                <div className="detail-image-container">
                    <img className="product-image-large" src={product.image}></img>
                </div>
                <div className="product-info-container-detail">
                    <h1 className="product-name-detail"> {product.title} </h1>
                    <span className="product-price-detail">{product.price.amount}</span>
                    <h1 className="product-description-detail"> {product.description} </h1>
                    <input type="button" className="add-to-cart">Agregar al carrito</input> {/* ToDo agregar al carrito*/}
                    <input type="button" className="purchase-button-detail">Comprar</input> {/* ToDo redirigir a pantalla de compra*/}
                </div>
            </div>
            <div className="edit-product-container"> {/* Esto se muestra solo si es usuario logueado es admin e hizo click en botón */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    editProduct();
                }}>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
                    <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
                    <input type="file" name="image" value={formData.image} onChange={handleImageChange} />
                    <input type="text" name="price" value={formData.price} onChange={handleInputChange} />
                    <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} />
                    <input type="text" name="status" value={formData.status} onChange={handleInputChange} />
                    <button type="submit">Guardar producto</button>
                    <button onClick={() => setEditModalOpen(false)}>Cancelar</button>
                </form>
            </div>
            <div className="delete-product-modal"> {/* Esto se muestra solo si es usuario logueado es admin e hizo click en botón */}
                <p className="confirm-delete-text">¿Estás seguro de que quieres eliminar la el producto?</p>
                <button className="confirm-delete-product" onClick={deleteProduct}>Eliminar producto</button>
                <button className="cancel-delete-product" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
            </div>
        </div>
    );
}

export default Product;