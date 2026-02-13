import Loader from '../components/common/Loader';
const Dashoboard = () => {
    return (
      <div className="h-[100%] w-[100%] bg-gray-50 p-8 rounded-[30px]">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">📋 Elenco Progetti</h1>
          <div className="text-center py-12">
            <Loader />
          </div>
        </div>
      </div>
    );
};

export default Dashoboard;