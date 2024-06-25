import { useEffect ,useState} from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,AppProvider, Spinner, TextField, FormLayout
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import axios from "axios";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const variantId =
    responseJson.data.productCreate.product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
      mutation shopifyRemixTemplateUpdateVariant($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            price
            barcode
            createdAt
          }
        }
      }`,
    {
      variables: {
        input: {
          id: variantId,
          price: Math.random() * 100,
        },
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantUpdate.productVariant,
  });
};

export default function Index() {
  const nav = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    price: '',
    vendor: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from backend when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        const response = await axios.put(`http://localhost:8000/api/product/${editingProduct._id}`, formData);
        setProducts(products.map((product) => (product._id === editingProduct._id ? response.data : product)));
        setEditingProduct(null);
      } else {
        // Add new product
        const response = await axios.post('http://localhost:8000/api/product', formData);
        setProducts([...products, response.data]);
      }
      setFormData({
        title: '',
        image: '',
        description: '',
        price: '',
        vendor: ''
      });
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/product/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      image: product.image,
      description: product.description,
      price: product.price,
      vendor: product.vendor
    });
  };

  return (
    <AppProvider i18n={{}}>
      <Page>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <FormLayout>
                <TextField label="Title" value={formData.title} onChange={handleChange('title')} />
                <TextField label="Image URL" value={formData.image} onChange={handleChange('image')} />
                <TextField label="Description" value={formData.description} onChange={handleChange('description')} />
                <TextField label="Price" value={formData.price} onChange={handleChange('price')} />
                <TextField label="Vendor" value={formData.vendor} onChange={handleChange('vendor')} />
                <Button onClick={handleSubmit} primary>
                  {editingProduct ? 'Update' : 'Submit'}
                </Button>
              </FormLayout>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card sectioned>
              {loading ? (
                <Spinner accessibilityLabel="Loading products" size="large" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {products.map((product) => (
                    <Card key={product._id} sectioned style={{ margin: '10px 0' }}>
                      <h2>{product.title}</h2>
                      <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                      <p>{product.description}</p>
                      <p>{product.price}</p>
                      <p>{product.vendor}</p>
                      <Button onClick={() => handleEdit(product)}>Edit</Button>
                      <Button onClick={() => handleDelete(product._id)}>Delete</Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
