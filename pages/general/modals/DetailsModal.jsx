import { Modal, Box, Typography, Button } from '@mui/material';

const DetailsModal = ({ open, handleClose, data, data_type, title }) => {
    console.log("data que llega en details modal: ", data_type, data);
    const renderContent = () => {
        if (data_type === 'product') {
            return renderProductContent();
        } else if (data_type === 'recipe') {
            return renderRecipeContent();
        }
    };

    const renderProductContent = () => {
        return (
            !open ? null :
                <>
                    <Typography variant="body1">
                        <strong>Id: </strong>
                        <span>{data.id_product}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Nombre: </strong>
                        <span>{data.title}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Precio: </strong>
                        <span>{data.price}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Foto: </strong>
                        <span>{data.image}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Descripción: </strong>
                        <span>{data.description}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tags: </strong>
                        <span>{data.tags}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tipo de catálogo: </strong>
                        <span>{data.catalog.catalog_id}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Nombre del catálogo: </strong>
                        <span>{data.catalog.type}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>ID de Receta: </strong>
                        <span>{data.recipe.id_recipe}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Nombre de la receta: </strong>
                        <span>{data.recipe.name}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Instrucciones de la receta: </strong>
                        <span>{data.recipe.instructions}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tiempo de preparación de la receta: </strong>
                        <span>{data.recipe.preparation_time_minutes}</span>
                    </Typography>
                </>
        );
    };

    const renderRecipeContent = () => {
        return (
            !open ? null :
                <>
                    <Typography variant="body1">
                        <strong>Id: </strong>
                        <span>{data.id_recipe}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Nombre: </strong>
                        <span>{data.name}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Instrucciones: </strong>
                        <span>{data.instructions}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tiempo de preparación: </strong>
                        <span>{data.preparationTimeMinutes}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Ingredientes:</strong>
                    </Typography>
                    {data.ingredients.map((ingredient) => (
                        <Typography key={ingredient.ingredient_id} variant="body1">
                            <span>Id: {ingredient.ingredient_id}</span><br />
                            <span>Nombre: {ingredient.name}</span><br />
                            <span>Unidad: {ingredient.unit}</span><br />
                            <span>Costo de última compra: {ingredient.last_purchase_cost}</span><br />
                            <span>Cantidad: {ingredient.quantity}</span><br />
                        </Typography>
                    ))}
                    <Typography variant="body1">
                        <strong>Producto:</strong>
                    </Typography>
                    <Typography variant="body1">
                        <span>Id: {data.product.id_product}</span><br />
                        <span>Nombre: {data.product.title}</span><br />
                        <span>Precio: {data.product.price}</span><br />
                        <span>Foto: {data.product.image}</span><br />
                        <span>Descripción: {data.product.description}</span><br />
                        <span>Tags: {data.product.tags}</span><br />
                        <span>Id del catálogo: {data.product.catalog.catalog_id}</span><br />
                        <span>Nombre del catálogo: {data.product.catalog.type}</span><br />
                    </Typography>
                </>
        );
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '500px',
                    bgcolor: 'background.paper',
                    borderRadius: '10px',
                    p: 3,
                    '& .MuiTypography-root': {
                        mb: 2,
                    },
                }}
            >
                <Typography variant="h5" align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: '#f1e5d5',
                        marginBottom: 2,
                    }}
                >
                    {title}
                </Typography>
                {renderContent()}
                <Button
                    sx={{
                        display: 'block',
                        mt: 2,
                        ml: 'auto',
                        mr: 'auto',
                        backgroundColor: '#EDCBA2',
                        color: '#7B3E19',
                        '&:hover': {
                            backgroundColor: '#CCA870',
                        },
                    }}
                    onClick={handleClose}
                >
                    Cerrar
                </Button>
            </Box>
        </Modal>
    );
}

export default DetailsModal;