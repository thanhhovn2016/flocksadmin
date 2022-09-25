import { api } from "../axios";
import {  createBlog, createBlogCategory, dashboardBlogCategory  } from "../constants";

 const CREATE_BLOG_CATEGORY = async (value: any) => {
    return await api.post(createBlogCategory, value);
  };

  const DELETE_BLOG_CATEGORY = async (value: any) => {
    return await api.delete(createBlogCategory+`${value}/`);
  };

  const UPDATE_BLOG_CATEGORY = async (value: any) => {
    return await api.put(createBlogCategory+`${value?.id}/`,value);
  };

  const CREATE_POST = async (value:any) => {
    return await api.post(createBlog , value)
  }
  const DELETE_POST = async (value:any) => {
    return await api.delete(createBlog+`${value}` )
  }
  const UPDATE_BLOG_POST = async (value:any) => {
    return await api.put(createBlog + `${value?.slug}/`, value)
  }
  const  UPDATE_ACTIVE_DE_ACTIVE_CATEGORY = async (variable:any) => {
    return await api.patch(dashboardBlogCategory + `${variable?.id}/` , variable)
  }
  export {
      CREATE_BLOG_CATEGORY,
      DELETE_BLOG_CATEGORY,
      UPDATE_BLOG_CATEGORY,
      CREATE_POST,
      DELETE_POST,
      UPDATE_BLOG_POST,
      UPDATE_ACTIVE_DE_ACTIVE_CATEGORY
  }