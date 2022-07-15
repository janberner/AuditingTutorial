
#include <json.hpp> 
#include <VehicleState.hpp>

using namespace eosio;

namespace vehicle_state { 


ACTION vehicleState::addsource(const name &source) {
   check(has_auth(get_self()), "You are not the owner of this contract");

   // create source_management table reference
   source_table sourceTable(get_self(), get_self().value);

   auto itr = sourceTable.find(source.value);
   check( itr == sourceTable.end(), "source already exists in the DB!");

   // write source in source_management
   sourceTable.emplace(get_self(), [&](auto& new_source){
      //                ^payer      ^callback lambda  
      new_source.source = source;
   });

   print("source ", source , " added to list.");
}

ACTION vehicleState::removesource(const name &source) {
   check(has_auth(get_self()), "You are not the owner of this contract");

   // create source_management table reference
   source_table sourceTable(get_self(), get_self().value);
   //                         ^Code       ^Scope 

   auto itr = sourceTable.find(source.value);
   check( itr != sourceTable.end(), "source does not exists in the DB!");

   // delete source from source_management
   sourceTable.erase(itr);

   print("source ", source , " removed from list.");
}


ACTION vehicleState::addkvp(const name &source, const std::string &vehicleId, const std::string &kvps) {
   check(has_auth(source), "You are not the correct source of data");
   
   source_table sourceTable(get_self(), get_self().value);
   auto source_itr = sourceTable.find(source.value);
   check( source_itr != sourceTable.end(), "You are not an allowed source to execute this action!");


   nlohmann::json j =  nlohmann::json::parse(kvps);
   nlohmann::json j_kvp =  nlohmann::json::parse(kvps);
   name vehicle = name(vehicleId);

   vehicle_state_table vehicleStateTable(get_self(), vehicle.value);

   for( auto& kvp: j_kvp.items()) {
      auto key = kvp.key();
      auto value = kvp.value();
      bool kvp_exist = false;
      // iter over vehicleState table rows
      for( auto row_itr = vehicleStateTable.begin(); row_itr != vehicleStateTable.end(); row_itr++ ) {
         // check if kvp for source already exists 
         if( row_itr->source == source && row_itr->key == key) {
            vehicleStateTable.modify(row_itr, get_self(), [&](auto& newkvp) {
               newkvp.value = value;
            });
            print("vehicleState entry with Key: ", key, " for vehicle ", vehicle, " updated.");
            kvp_exist = true;
         }
      }

      // if key does not exist create new entry 
      if(!kvp_exist) {
         vehicleStateTable.emplace(get_self(), [&](auto& newkvp) {
            newkvp.id = vehicleStateTable.available_primary_key();
            newkvp.source = source;
            newkvp.key = key;
            newkvp.value = value;
         });
         print("vehicleStateTable entry with Key: ", key, " for vehicle ", vehicle, " created.");
            
      }

   }

}


ACTION vehicleState::removekvp(const name &source, const std::string &vehicleId, const std::string &key) {
   check(has_auth(source), "You are not the correct source of data");
   
   source_table sourceTable(get_self(), get_self().value);
   auto source_itr = sourceTable.find(source.value);
   check( source_itr != sourceTable.end(), "You are not an allowed source to execute this action!");

   name vehicle = name(vehicleId);
   vehicle_state_table vehicleStateTable(get_self(), vehicle.value);

   for( auto itr = vehicleStateTable.begin(); itr != vehicleStateTable.end(); itr++ ) {
      if ( itr->source == source && itr->key == key){
         vehicleStateTable.erase(itr);
         print("Entry with key ", key, " removed from vehicleState.");
         return;
      }
   }
   check(0,"Key-value-pair does not exist.");
}


ACTION vehicleState::clearkvps(const name &source, const std::string &vehicleId) {
   check(has_auth(source), "You are not the correct source");
   
   source_table sourceTable(get_self(), get_self().value);
   auto source_itr = sourceTable.find(source.value);
   check( source_itr != sourceTable.end(), "You are not an allowed source to execute this action!");

   name vehicle = name(vehicleId);
   vehicle_state_table vehicleStateTable(get_self(), vehicle.value);

   for (auto itr = vehicleStateTable.begin(); itr != vehicleStateTable.end();) {
      if (itr->source == source) {
         itr = vehicleStateTable.erase(itr);
      }
   }

   print("vehicleState table for vehilce: ", vehicleId, " has been cleared!");
}

}