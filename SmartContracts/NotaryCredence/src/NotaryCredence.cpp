#include <NotaryCredence.hpp>


using namespace eosio;

namespace notary_Credence { 

ACTION notarCrednce::savehash(const std::string& block_id, const std::string& timestamp ) {
   require_auth(get_self());
   
   notaryCredence_table hashes_table(get_self(), get_self().value );

   hashes_table.emplace(get_self(), [&](auto& new_row){
      new_row.id = hashes_table.available_primary_key();
      new_row.block_id = block_id;
      new_row.timestamp = timestamp;
   });

}

}