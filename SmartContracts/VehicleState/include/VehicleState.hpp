#pragma once 


#include <eosio/eosio.hpp>
#include <eosio/action.hpp>

using namespace eosio; 

namespace vehicle_state {

CONTRACT vehicleState : public contract { 
    public:
        using contract::contract; 

        // source management
        TABLE Source { 
            name source;
            auto primary_key() const { return source.value; }
        };

        // vehicle State 
        TABLE State {
            uint64_t id;
            name source;
            std::string key;
            std::string value;
            std::string flag;
            auto primary_key() const { return id; }
        };

        // Define - constructor of multi index table
        typedef multi_index<name("sourcemanag"),   // table name in state
            Source>                                // table struct 
            source_table;                         // type           
        typedef multi_index<name("vehiclestate"), State> vehicle_state_table ;


        // Samrt contract actions
        ACTION addsource(const name &source);
        ACTION removesource(const name &source);
        ACTION addkvp(const name &source, const std::string &vehicleId, const std::string &kvps);
        ACTION removekvp(const name &source, const std::string &vehicleId, const std::string &key);
        ACTION clearkvps(const name &source, const std::string &vehicleId);
    };  
}