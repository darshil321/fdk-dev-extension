import React from 'react';
import './CreateBundle.css';
import { GroupTable } from '../GroupTable/GroupTable';
import { Button, Dropdown, Input } from 'paul-fds-ui';
import { Icons } from 'paul-icons-react';
import { Formik, Form } from 'formik';

import * as Yup from 'yup';
import { useCreateBundleMutation, useGetGroupsQuery } from '@/store/api';

const Card = ({ children, className }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

const validationSchema = Yup.object().shape({
  basicInfo: Yup.object().shape({
    name: Yup.string().required('Bundle name is required'),
    description: Yup.string(),
    itemCode: Yup.string().required('Item code is required'),
    slug: Yup.string().required('Slug is required'),
    imageUrl: Yup.string().url('Must be a valid URL')
  }),
  pricing: Yup.object().shape({
    actualPrice: Yup.number().required('Actual price is required'),
    sellingPrice: Yup.number().required('Selling price is required')
  }),
  shipping: Yup.object().shape({
    length: Yup.number().positive('Must be positive'),
    width: Yup.number().positive('Must be positive'),
    height: Yup.number().positive('Must be positive'),
    weight: Yup.number().positive('Must be positive')
  })
});

const CreateBundle = ({ companyId, onClose }) => {
  const { data: groups } = useGetGroupsQuery();
  const [createBundle, { isLoading }] = useCreateBundleMutation();

  const initialValues = {
    basicInfo: {
      name: '',
      description: '',
      itemCode: '',
      slug: '',
      imageUrl: ''
    },
    selectedGroups: [],
    pricing: {
      actualPrice: '',
      sellingPrice: ''
    },
    shipping: {
      length: '',
      width: '',
      height: '',
      weight: ''
    },
    attributes: {
      essential: '',
      productMaterial: '',
      productColor: '',
      productFit: '',
      gender: ''
    }
  };

  const handleSubmit = async (values) => {
    try {
      await createBundle({
        ...values.basicInfo,
        groups: values.selectedGroups,
        pricing: values.pricing,
        shipping: values.shipping,
        attributes: values.attributes
      }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to create bundle:', error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
              try {
                await handleSubmit(values);
                onClose();
              } catch (error) {
                console.error('Failed to create bundle:', error);
              } finally {
                setSubmitting(false);
              }
            }}
    >
      {({ values, handleChange, setFieldValue, errors, touched }) => (
        <Form className="create-bundle-container">
          <div className="bundle-header">
            <div className="header-left">
              <Button
                kind="secondary"
                onClick={onClose}
                icon={<Icons name="arrow-left" />}
              />
              <h2>Bundle</h2>
            </div>
            <Button kind="primary" type="submit" loading={isLoading}>
              Save
            </Button>
          </div>

          <Card className="form-card">
            <h3 className="card-title">Basic Information</h3>
            <div className="form-grid">
              <Input
                label="Bundle Name"
                name="basicInfo.name"
                value={values.basicInfo.name}
                onChange={handleChange}
                error={touched.basicInfo?.name && errors.basicInfo?.name}
                required
              />
              <Input
                label="Short Description"
                name="basicInfo.description"
                value={values.basicInfo.description}
                onChange={handleChange}
                multiline
              />
              <Input
                label="Item Code"
                name="basicInfo.itemCode"
                value={values.basicInfo.itemCode}
                onChange={handleChange}
                error={touched.basicInfo?.itemCode && errors.basicInfo?.itemCode}
              />
              <Input
                label="Slug"
                name="basicInfo.slug"
                value={values.basicInfo.slug}
                onChange={handleChange}
                error={touched.basicInfo?.slug && errors.basicInfo?.slug}
              />
              <Input
                label="Image URL"
                name="basicInfo.imageUrl"
                value={values.basicInfo.imageUrl}
                onChange={handleChange}
                error={touched.basicInfo?.imageUrl && errors.basicInfo?.imageUrl}
                placeholder="Enter image URL"
              />
            </div>
          </Card>

          <Card className="form-card">
            <h3 className="card-title">Groups</h3>
            <Dropdown
              label="Select Groups"
              searchable
              options={groups || []}
              value={values.selectedGroups}
              onChange={(selected) => {
                setFieldValue('selectedGroups', [...values.selectedGroups, selected]);
              }}
            />

            {values.selectedGroups.map((group, index) => (
              <GroupTable
                key={group.value}
                group={group}
                onRemove={() => {
                  const newGroups = [...values.selectedGroups];
                  newGroups.splice(index, 1);
                  setFieldValue('selectedGroups', newGroups);
                }}
              />
            ))}

            <Button
              kind="secondary"
              onClick={() => {/* Open group selection */}}
            >
              Add Another Group
            </Button>
          </Card>

          <Card className="form-card">
            <h3 className="card-title">Indicative Price</h3>
            <div className="form-grid">
              <Input
                label="Actual Price"
                type="number"
                name="pricing.actualPrice"
                value={values.pricing.actualPrice}
                onChange={handleChange}
                error={touched.pricing?.actualPrice && errors.pricing?.actualPrice}
              />
              <Input
                label="Selling Price"
                type="number"
                name="pricing.sellingPrice"
                value={values.pricing.sellingPrice}
                onChange={handleChange}
                error={touched.pricing?.sellingPrice && errors.pricing?.sellingPrice}
              />
            </div>
          </Card>

          <Card className="form-card">
            <h3 className="card-title">Shipping Details</h3>
            <h4 className="card-subtitle">Packaging Measurements</h4>
            <div className="form-grid">
              <Input
                label="Length"
                type="number"
                name="shipping.length"
                value={values.shipping.length}
                onChange={handleChange}
                error={touched.shipping?.length && errors.shipping?.length}
              />
              <Input
                label="Width"
                type="number"
                name="shipping.width"
                value={values.shipping.width}
                onChange={handleChange}
                error={touched.shipping?.width && errors.shipping?.width}
              />
              <Input
                label="Height"
                type="number"
                name="shipping.height"
                value={values.shipping.height}
                onChange={handleChange}
                error={touched.shipping?.height && errors.shipping?.height}
              />
              <Input
                label="Weight"
                type="number"
                name="shipping.weight"
                value={values.shipping.weight}
                onChange={handleChange}
                error={touched.shipping?.weight && errors.shipping?.weight}
              />
            </div>
          </Card>

          <Card className="form-card">
            <h3 className="card-title">Attributes</h3>
            <div className="form-grid">
              <Input
                label="Essential"
                name="attributes.essential"
                value={values.attributes.essential}
                onChange={handleChange}
              />
              <Input
                label="Product Material"
                name="attributes.productMaterial"
                value={values.attributes.productMaterial}
                onChange={handleChange}
              />
              <Input
                label="Product Color"
                name="attributes.productColor"
                value={values.attributes.productColor}
                onChange={handleChange}
              />
              <Input
                label="Product Fit"
                name="attributes.productFit"
                value={values.attributes.productFit}
                onChange={handleChange}
              />
              <Input
                label="Gender"
                name="attributes.gender"
                value={values.attributes.gender}
                onChange={handleChange}
              />
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default CreateBundle;
