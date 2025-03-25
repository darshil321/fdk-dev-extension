import React, { useState } from "react";
import "./CreateBundle.css";
import GroupTable from "../GroupTable/GroupTable";
import { Button, Input } from "paul-fds-ui";
import { Formik } from "formik";

import * as Yup from "yup";
import { useCreateBundleMutation } from "@/store/api";
import FormCard from "../../common/FormCard/FormCard";
import { groupOptions, productsData } from "@/constants/data";
import SvgIcon from "../../Icons/LeftArrow";
import InputField from "../../common/Form/Input/Input";
import { useGetGroupsQuery } from "@/store/services/bundles";
import SearchableDropdown from "../../common/Form/AutoCompleteDropdown/AutoCompleteDropdown";

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

const CreateBundle = ({ companyId, applicationId, onClose }) => {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [createBundleMutation, { isLoading }] = useCreateBundleMutation();
  const [localHighlights, setLocalHighlights] = useState([]);
  const [error, setError] = useState(null);

  const { data: groups = [] } = useGetGroupsQuery();

  // Highlights management functions
  const addHighlight = () => {
    const newHighlights = [...localHighlights, ""];
    setLocalHighlights(newHighlights);
  };

  const updateHighlight = (index, value) => {
    const newHighlights = [...localHighlights];
    newHighlights[index] = value;
    setLocalHighlights(newHighlights);
  };

  const deleteHighlight = (index) => {
    const newHighlights = [...localHighlights];
    newHighlights.splice(index, 1);
    setLocalHighlights(newHighlights);
  };

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

  // Transform form data for API submission
  const transformFormData = (values) => {
    try {
      // Create components from selected groups
      const components = values.selectedGroups.map((group) => ({
        name: group.label,
        type: "node",
        group: group.value,
        products: (productsData[group.value] || []).map((product) => ({
          item_uid: product.id,
          price: parseFloat(product.price) || 0,
          quantity: 1,
        })),
      }));

      return {
        name: values.basicInfo.name,
        item_code: values.basicInfo.itemCode,
        slug: values.basicInfo.slug,
        short_description: values.basicInfo.description,
        components: components,
        indicative_price: {
          selling_price: parseFloat(values.pricing.sellingPrice) || 0,
          actual_price: parseFloat(values.pricing.actualPrice) || 0,
        },
        is_active: true,
      };
    } catch (err) {
      console.error("Error transforming form data:", err);
      setError("Error preparing form data. Please check your inputs.");
      throw err;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setError(null);
          const bundleData = transformFormData(values);
          await createBundleMutation({
            companyId,
            applicationId,
            data: bundleData,
          }).unwrap();
          onClose && onClose();
        } catch (error) {
          console.error("Failed to create bundle:", error);
          setError(
            error.message || "Failed to create bundle. Please try again."
          );
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
        <form className="create-bundle-container" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="bundle-header">
            <div className="header-left">
              <div style={{ display: "flex" }}>
                <Button
                  kind="tertiary"
                  onClick={onClose}
                  icon={<SvgIcon name="arrow-left" />}
                />
              </div>
              <h2 className="header-title">Bundle</h2>
            </div>
            <Button
              kind="primary"
              type="submit"
              loading={isLoading || isSubmitting}
            >
              Save
            </Button>
          </div>

          <div className="form-container-wrapper">
            <div className="form-container">
              <FormCard className="form-card">
                <h3 className="card-title">Basic Information</h3>
                <div className="form-full-w-grid">
                  <InputField
                    label="Bundle Name"
                    placeholder="For e.g Black T-Shirt"
                    name="basicInfo.name"
                    value={values.basicInfo.name}
                    onChange={handleChange}
                    error={touched.basicInfo?.name && errors.basicInfo?.name}
                    required
                  />
                  <InputField
                    label="Short Description"
                    name="basicInfo.description"
                    placeholder="For e.g. A Classic stripe shirt in black"
                    value={values.basicInfo.description}
                    onChange={handleChange}
                    multiline
                  />
                </div>
                <div className="form-grid" style={{ marginTop: "24px" }}>
                  <div className="input-row">
                    <InputField
                      label="Slug"
                      placeholder="For eg. black-casual-shirt"
                      name="basicInfo.slug"
                      value={values.basicInfo.slug}
                      onChange={handleChange}
                      error={touched.basicInfo?.slug && errors.basicInfo?.slug}
                      required
                    />
                    <InputField
                      label="Item Code"
                      name="basicInfo.itemCode"
                      placeholder="For eg. black-casual-shirt"
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
                  {!values.media || values.media.length === 0 ? (
                    <div className="empty-media">No media uploaded yet</div>
                  ) : (
                    <div className="media-grid">
                      {values.media.map((item, index) => (
                        <div key={index} className="media-item">
                          <img src={item.url} alt={`Media ${index + 1}`} />
                          <div className="media-actions">
                            <Button kind="tertiary">Edit</Button>
                            <Button kind="tertiary">Remove</Button>
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
                    <h3 className="card-title" style={{ marginBottom: "8px" }}>
                      Component
                    </h3>
                    <p className="subtitle">
                      Select all Groups to apply to this bundle
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <FormCard variant="secondary">
                    {/* Render the group selector only when needed */}
                    {(values.selectedGroups.length === 0 || showAddGroup) && (
                      <SearchableDropdown
                        label="Select Group"
                        placeholder="E.g: Saver Pack"
                        options={groupOptions}
                        onChange={(option) => {
                          try {
                            // Check if group already exists
                            if (
                              !values.selectedGroups.some(
                                (g) => g.value === option.value
                              )
                            ) {
                              // Add the group to the list
                              setFieldValue("selectedGroups", [
                                ...values.selectedGroups,
                                option,
                              ]);

                              // Hide the dropdown after selection
                              setShowAddGroup(false);
                            }
                          } catch (err) {
                            console.error("Error adding group:", err);
                          }
                        }}
                        onAddNew={() => {
                          console.log("Add new group");
                        }}
                        itemsPerPage={10}
                      />
                    )}

                    {/* Render selected groups as tables */}
                    {values.selectedGroups &&
                      values.selectedGroups.map((group, index) => (
                        <GroupTable
                          key={`${group.value}-${index}`}
                          group={group}
                          products={
                            productsData && productsData[group.value]
                              ? productsData[group.value]
                              : []
                          }
                          onRemove={() => {
                            try {
                              const newGroups = [...values.selectedGroups];
                              newGroups.splice(index, 1);
                              setFieldValue("selectedGroups", newGroups);
                            } catch (err) {
                              console.error("Error removing group:", err);
                            }
                          }}
                        />
                      ))}
                  </FormCard>
                </div>

                {/* Add Group button - only show when not already selecting */}
                <div className="add-group-section">
                  <div className="add-group-container">
                    <Button
                      kind="tertiary"
                      className="add-group-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAddGroup(true);
                      }}
                    >
                      + Add Group
                    </Button>
                  </div>
                </div>
              </FormCard>

              <FormCard>
                <div>
                  <h3 className="card-title">Overview</h3>
                  <div className="overview">
                    <FormCard variant="secondary">
                      <p className="card-subtitle">Description</p>
                      <div style={{ marginTop: "16px" }}>
                        <InputField
                          helperText=""
                          onChange={function Ya() {}}
                          placeholder="For e.g. A classic stripe shirt in black made with a blend of cotton and polyster"
                          size="m"
                          type="richtextarea"
                          validationText=""
                        />
                      </div>
                    </FormCard>
                    <FormCard variant="secondary">
                      <div className="highlights-section">
                        <p className="card-subtitle">Highlights</p>
                        <div
                          onClick={() => {
                            addHighlight();
                          }}
                          className="add-highlight-btn"
                        >
                          + Add New Highlight
                        </div>
                      </div>
                      <div className="highlights-container">
                        {localHighlights.length === 0 ? (
                          <div className="empty-highlights">
                            <p>No highlights added yet</p>
                          </div>
                        ) : (
                          <div className="highlights-list">
                            {localHighlights.map((highlight, index) => (
                              <div
                                key={index}
                                className="highlight-item-container"
                              >
                                <InputField
                                  placeholder="For eg. All day battery backup"
                                  value={highlight}
                                  onChange={(e) =>
                                    updateHighlight(index, e.target.value)
                                  }
                                />
                                <div
                                  className="delete-highlight"
                                  onClick={() => deleteHighlight(index)}
                                >
                                  <SvgIcon name="trash" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormCard>
                  </div>
                </div>
              </FormCard>
              <FormCard>
                <h3 className="card-title">Indicative Price</h3>
                <div className="form-grid">
                  <InputField
                    label="Actual Price"
                    type="number"
                    prefix={
                      <div style={{ paddingLeft: "8px" }}>
                        <SvgIcon name="price-prefix" />
                      </div>
                    }
                    name="pricing.actualPrice"
                    value={values.pricing.actualPrice}
                    onChange={handleChange}
                    className="price-input"
                    error={
                      touched.pricing?.actualPrice &&
                      errors.pricing?.actualPrice
                    }
                    required
                  />
                  <InputField
                    label="Selling Price"
                    type="number"
                    name="pricing.sellingPrice"
                    prefix={
                      <div style={{ paddingLeft: "8px" }}>
                        <SvgIcon name="price-prefix" />
                      </div>
                    }
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
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default CreateBundle;
