import { Edit3, Type, List, Save, X, Star , HelpCircle } from 'lucide-react';
import { auth } from '../firebase';

const Sidebar = ({
  editmaintitle,
  seteditmaintitle,
  editsubtitle,
  seteditsubtitle,
  benefits,
  setBenefits,
  setshowsidebar,
  features,
  featuresexplanation,
  setFeatures,
  setFeaturesExplanation,

  whyuseline,
  whyusepoints,
  setWhyuseLine,
  setWhyUsePoints
}) => {



  const user = auth.currentUser;




  const handleBenefitChange = (index, field, value) => {
    const updated = [...benefits];
    updated[index][field] = value;
    setBenefits(updated);
  };

  const addBenefit = () => {
    setBenefits([...benefits, { title: '', subtitle: '' }]);
  };

  const removeBenefit = (index) => {
    if (benefits.length > 1) {
      const updated = benefits.filter((_, i) => i !== index);
      setBenefits(updated);
    }
  };

  const handleFeatureChange = (index, field, value) => {
    if (field === 'feature') {
      const updated = [...features];
      updated[index] = value;
      setFeatures(updated);
    } else if (field === 'explanation') {
      const updated = [...featuresexplanation];
      updated[index] = value;
      setFeaturesExplanation(updated);
    }
  };

  const addFeature = () => {
    setFeatures([...features, '']);
    setFeaturesExplanation([...featuresexplanation, '']);
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
      setFeaturesExplanation(featuresexplanation.filter((_, i) => i !== index));
    }
  };

const handleWhyUseLineChange = (value) => {
  setWhyuseLine(value);
};


const handleWhyUsePointChange = (index, value) => {
  const updated = [...whyusepoints];
  updated[index] = value;
  setWhyUsePoints(updated);
};


const addWhyUsePoint = () => {
  setWhyUsePoints([...whyusepoints, '']);
};


const removeWhyUsePoint = (index) => {
  if (whyusepoints.length > 1) {
    setWhyUsePoints(whyusepoints.filter((_, i) => i !== index));
  }
};


  return (
    <div className="relative h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Close Button */}
      <button
        onClick={() => setshowsidebar(false)}
        className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Content Editor</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Customize your page content</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-8 overflow-y-auto max-h-[calc(100vh-100px)]">
        {/* Main Headings */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Type className="w-4 h-4 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-900">Page Headings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={editmaintitle}
                onChange={(e) => seteditmaintitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your main title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={editsubtitle}
                onChange={(e) => seteditsubtitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your subtitle"
              />
            </div>
          </div>
        </section>


{user && (<>

<section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Features</h2>
            </div>
            <button
              onClick={addFeature}
              className="px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
            >
              + Add
            </button>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Feature {index + 1}
                  </span>
                  {features.length > 1 && (
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={features[index]}
                    onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Feature name"
                  />
                  <textarea
                    value={featuresexplanation[index]}
                    onChange={(e) =>
                      handleFeatureChange(index, 'explanation', e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none"
                    placeholder="Feature explanation"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>



        
        {/* Why Use */}
<section>
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-2">
      <HelpCircle className="w-4 h-4 text-gray-600" />
      <h2 className="text-lg font-medium text-gray-900">Why Use</h2>
    </div>
  </div>

  {/* Main line */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Main Reason Line
    </label>
    <input
      type="text"
      value={whyuseline}
      onChange={(e) => handleWhyUseLineChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
      placeholder="Enter main reason headline"
    />
  </div>

  {/* Points */}
  <div className="space-y-4">
    {whyusepoints.map((point, index) => (
      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Reason {index + 1}
          </span>
          {whyusepoints.length > 1 && (
            <button
              onClick={() => removeWhyUsePoint(index)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          )}
        </div>

        <input
          type="text"
          value={point}
          onChange={(e) => handleWhyUsePointChange(index, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Enter reason"
        />
      </div>
    ))}
  </div>

  <div className="mt-3">
    <button
      onClick={addWhyUsePoint}
      className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
    >
      + Add Reason
    </button>
  </div>
</section>


        {/* Benefits */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <List className="w-4 h-4 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Benefits</h2>
            </div>
            <button
              onClick={addBenefit}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              + Add
            </button>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Benefit {index + 1}
                  </span>
                  {benefits.length > 1 && (
                    <button
                      onClick={() => removeBenefit(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={benefit.title}
                    onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Benefit title"
                  />
                  <textarea
                    value={benefit.subtitle}
                    onChange={(e) => handleBenefitChange(index, 'subtitle', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none"
                    placeholder="Benefit description"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

</>)}
        




        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setshowsidebar(false)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
