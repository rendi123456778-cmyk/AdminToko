import { createContext, useCallback, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./ApiClient";

// Buat konteks
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const getStockProducts = async ({ status = "all", page = 1, limit = 10 }) => {
    const res = await apiClient.get("/products/stock-monitor", {
      params: { status, page, limit },
    });

    return res.data;
  };

  // GET ALL PRODUCTS
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiClient.get("/products");
      return res.data.data;
    },
  });

  // SHOW PRODUCT DETAIL
  const getProductById = useCallback(async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  }, []);

  // STORE PRODUCT
  const addProduct = async (formData) => {
    try {
      const response = await apiClient.post("/products", formData);

      queryClient.invalidateQueries({ queryKey: ["products"] });

      return response;
    } catch (error) {
      throw error;
    }
  };

  // UPDATE PRODUCT
  const updateProduct = async (id, formData) => {
    try {
      const response = await apiClient.post(
        `/products/${id}?_method=PUT`,
        formData,
      );

      queryClient.invalidateQueries({ queryKey: ["products"] });

      return response;
    } catch (error) {
      throw error;
    }
  };

  // DELETE PRODUCT
  const deleteProduct = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // AMBIL DATA KATEGORI
  const getCategories = async () => {
    const res = await apiClient.get("/categories");
    return res.data;
  };

  // GET PRODUCTS DENGAN FILTER DAN PAGINATION
  const getProducts = async ({
    page = 1,
    limit = 10,
    category_id = "",
    keyword = "",
  }) => {
    const res = await apiClient.get("/products", {
      params: {
        page,
        limit,
        category_id,
        keyword,
      },
    });

    // Mengembalikan data beserta metadata pagination
    return res.data;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        isError,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getCategories,
        getProducts,
        getStockProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
