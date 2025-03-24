import React from "react";
import "./CreateBundle.css";
import  GroupTable  from "../GroupTable/GroupTable";
import { Button, Input } from "paul-fds-ui";
import { Icons } from "paul-icons-react";
import { Formik } from "formik";

import * as Yup from "yup";
import { useCreateBundleMutation } from "@/store/api";
import { useState } from "react";
import FormCard from "../../common/FormCard/FormCard";
import { groupOptions, productsData } from "@/constants/data";

const validationSchema = Yup.object().shape({
  basicInfo: Yup.object().shape({
    name: Yup.string().required("Bundle name is required"),
    description: Yup.string(),
    itemCode: Yup.string().required("Item code is required"),
    slug: Yup.string().required("Slug is required"),
    imageUrl: Yup.string().url("Must be a valid URL"),
  }),
  pricing: Yup.object().shape({
    actualPrice: Yup.number().required("Actual price is required"),
    sellingPrice: Yup.number().required("Selling price is required"),
  }),
  shipping: Yup.object().shape({
    length: Yup.number().positive("Must be positive"),
    width: Yup.number().positive("Must be positive"),
    height: Yup.number().positive("Must be positive"),
    weight: Yup.number().positive("Must be positive"),
  }),
});

const CreateBundle = ({  onClose }) => {

  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [selectedGroupValue, setSelectedGroupValue] = useState("");
  const [createBundleMutation, { isLoading }] = useCreateBundleMutation();

  const initialValues = {
    basicInfo: {
      name: "",
      description: "",
      itemCode: "",
      slug: "",
      imageUrl: "",
    },
    selectedGroups: [],
    pricing: {
      actualPrice: "",
      sellingPrice: "",
    },
    shipping: {
      length: "",
      width: "",
      height: "",
      weight: "",
    },
    attributes: {
      essential: "",
      productMaterial: "",
      productColor: "",
      productFit: "",
      gender: "",
    },
    media: [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await createBundleMutation({
            ...values.basicInfo,
            groups: values.selectedGroups,
            pricing: values.pricing,
            shipping: values.shipping,
            attributes: values.attributes,
          });
          onClose();
        } catch (error) {
          console.error("Failed to create bundle:", error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        handleChange,
        setFieldValue,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
      }) => (
        <form className="create-bundle-container">
          <div className="bundle-header">
            <div className="header-left">
              <div
                style={{
                  background: "",
                  display: "flex",
                  padding: "12px",
                }}
              >
                {/* <IconButton
                  appearance="error"
                  icon={<Icons name="arrow-left" />}
                  isClickable
                  kind="primary"
                  onClick={onClose}
                  size="l"
                /> */}
              </div>
              <h2>Bundle</h2>
            </div>
            <Button kind="primary" type="submit" loading={isSubmitting}>
              Save
            </Button>
          </div>
          <div className="form-container-wrapper">
            <div className="form-container">
              <FormCard className="form-card">
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
                  <div className="input-row">
                    <Input
                      label="Slug"
                      name="basicInfo.slug"
                      value={values.basicInfo.slug}
                      onChange={handleChange}
                      error={touched.basicInfo?.slug && errors.basicInfo?.slug}
                      required
                    />
                    <Input
                      label="Item Code"
                      name="basicInfo.itemCode"
                      value={values.basicInfo.itemCode}
                      onChange={handleChange}
                      error={
                        touched.basicInfo?.itemCode &&
                        errors.basicInfo?.itemCode
                      }
                      required
                    />
                  </div>
                </div>
              </FormCard>

              <FormCard>
                <div className="section-header">
                  <h3 className="card-title">Media</h3>
                  <Button
                    kind="secondary"
                    onClick={() => {}}
                    className="add-media-btn"
                  >
                    + Add Media
                  </Button>
                </div>
                <div className="media-preview">
                  {values.media.length === 0 ? (
                    <div className="empty-media">No media uploaded yet</div>
                  ) : (
                    <div className="media-grid">
                      {values.media.map((item, index) => (
                        <div key={index} className="media-item">
                          <img src={item.url} alt={`Media ${index + 1}`} />
                          <div className="media-actions">
                            <Button
                              kind="tertiary"
                              icon={<Icons name="edit" />}
                            />
                            <Button
                              kind="tertiary"
                              icon={<Icons name="trash" />}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormCard>

              <FormCard>
                <div className="component-header">
                  <div>
                    <h3 className="card-title">Component</h3>
                    <p className="card-subtitle">
                      Select all Groups to apply to this bundle
                    </p>
                  </div>
                  <Button
                    kind="secondary"
                    onClick={() => {}}
                    className="add-btn"
                  >
                    Add
                  </Button>
                </div>

                {values.selectedGroups.map((group, index) => (
                  <GroupTable
                    key={`${group.value}-${index}`}
                    group={group}
                    products={productsData[group.value] || []}
                    onRemove={() => {
                      const newGroups = [...values.selectedGroups];
                      newGroups.splice(index, 1);
                      setFieldValue("selectedGroups", newGroups);
                    }}
                  />
                ))}

                <div className="add-group-section">
                  <div className="add-group-container">
                    <Button
                      kind="text"
                      className="add-group-btn"
                      onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                    >
                      + Add Group
                    </Button>

                    {showGroupDropdown && (
                      <div className="group-dropdown">
                        <div className="group-dropdown-header">
                          <p>Select Group</p>
                          <div className="group-search">
                            <Input
                              placeholder="Pizza"
                              value={selectedGroupValue}
                              onChange={(e) =>
                                setSelectedGroupValue(e.target.value)
                              }
                            />
                            <Button
                              kind="tertiary"
                              icon={<Icons name="x" />}
                              onClick={() => setSelectedGroupValue("")}
                            />
                            <Button
                              kind="tertiary"
                              icon={<Icons name="chevron-up" />}
                              onClick={() => setShowGroupDropdown(false)}
                            />
                          </div>
                        </div>
                        <div className="group-dropdown-options">
                          {groupOptions
                            .filter((group) =>
                              group.label
                                .toLowerCase()
                                .includes(selectedGroupValue.toLowerCase())
                            )
                            .map((group) => (
                              <div
                                key={group.value}
                                className="group-option"
                                onClick={() => {
                                  if (
                                    !values.selectedGroups.some(
                                      (g) => g.value === group.value
                                    )
                                  ) {
                                    setFieldValue("selectedGroups", [
                                      ...values.selectedGroups,
                                      group,
                                    ]);
                                  }
                                  setShowGroupDropdown(false);
                                  setSelectedGroupValue("");
                                }}
                              >
                                {group.label}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FormCard>

              <FormCard>
                <h3 className="card-title">Indicative Price</h3>
                <div className="form-grid">
                  <Input
                    label="Actual Price"
                    type="number"
                    name="pricing.actualPrice"
                    value={values.pricing.actualPrice}
                    onChange={handleChange}
                    error={
                      touched.pricing?.actualPrice &&
                      errors.pricing?.actualPrice
                    }
                    required
                  />
                  <Input
                    label="Selling Price"
                    type="number"
                    name="pricing.sellingPrice"
                    value={values.pricing.sellingPrice}
                    onChange={handleChange}
                    error={
                      touched.pricing?.sellingPrice &&
                      errors.pricing?.sellingPrice
                    }
                    required
                  />
                </div>
              </FormCard>

              <FormCard>
                <h3 className="card-title">Shipping Details</h3>
                <h4 className="card-subtitle">Packaging Measurements</h4>
                <div className="form-grid shipping-grid">
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
              </FormCard>

              <FormCard>
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
              </FormCard>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default CreateBundle;
