#include <eosio/eosio.hpp>

using namespace eosio;

namespace notary_Credence {

CONTRACT notarCrednce : public contract {
   public:
      using contract::contract;

      TABLE notaryCredenceModel {
         uint64_t id  = 0;
         std::string block_id;
         std::string timestamp;
         auto primary_key() const { return id; }
      };

      typedef multi_index<name("notarcrednce"), notaryCredenceModel> notaryCredence_table ;

      ACTION savehash(const std::string& block_id, const std::string& timestamp);
};

}