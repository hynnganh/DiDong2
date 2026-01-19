import React from "react";
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    Create,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ReferenceInput,
    SelectInput,
    EditButton,
    DeleteButton,
    useRecordContext,
    Filter,
    ImageField,
} from "react-admin";
import { Link as RouterLink } from "react-router-dom";

/* ---------------------------
   🖼️ Custom Image Field
---------------------------- */
const CustomImageField = ({ source, label }: { source: string; label?: string }) => {
    const record = useRecordContext();

    if (!record || !record[source]) {
        return <span>No Image</span>;
    }

    return (
        <RouterLink to={`/products/${record.productId}/update-image`}>
            <img
                src={record[source]}
                alt="Product"
                style={{
                    width: "100px",
                    height: "auto",
                    borderRadius: "6px",
                    objectFit: "cover",
                }}
            />
        </RouterLink>
    );
};

/* ---------------------------
   🔍 Product Filters
---------------------------- */
const ProductFilters = (props: any) => (
    <Filter {...props}>
        <TextInput label="Search" source="search" alwaysOn />
        <ReferenceInput
            label="Category"
            source="categoryId"
            reference="categories"
            allowEmpty
        >
            <SelectInput optionText="categoryName" />
        </ReferenceInput>
    </Filter>
);

/* ---------------------------
   📋 Product List
---------------------------- */
export const ProductList = () => (
    <List filters={<ProductFilters />}>
        <Datagrid rowClick={false}>
            <TextField source="productId" label="Product ID" />
            <TextField source="productName" label="Product Name" />
            <TextField source="category.categoryName" label="Category" />
            <CustomImageField source="image" label="Image" />
            <TextField source="description" label="Description" />
            <NumberField source="quantity" label="Quantity" />
            <NumberField source="price" label="Price" />
            <NumberField source="discount" label="Discount (%)" />
            <NumberField source="specialPrice" label="Special Price" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

/* ---------------------------
   ➕ Product Create
---------------------------- */
export const ProductCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput
                source="productName"
                label="Product Name"
                helperText="(At least 3 characters)"
            />
            <TextInput
                source="description"
                label="Description"
                helperText="(At least 6 characters)"
            />
            <NumberInput source="quantity" label="Quantity" />
            <NumberInput source="price" label="Price" />
            <NumberInput source="discount" label="Discount (%)" />
            <NumberInput source="specialPrice" label="Special Price" />
            <ReferenceInput
                source="categoryId"
                reference="categories"
                label="Category"
            >
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

/* ---------------------------
   ✏️ Product Edit
---------------------------- */
export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="productId" label="Product ID" disabled />
            <ReferenceInput
                source="categoryId"
                reference="categories"
                label="Category"
            >
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
            <TextInput source="productName" label="Product Name" />
            <TextInput source="description" label="Description" />
            <NumberInput source="quantity" label="Quantity" />
            <NumberInput source="price" label="Price" />
            <NumberInput source="discount" label="Discount (%)" />
            <NumberInput source="specialPrice" label="Special Price" />
            <ImageField source="image" label="Current Image" />
        </SimpleForm>
    </Edit>
);
